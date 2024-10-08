#!/bin/bash

set -e

RECORD_FILE=tmp.rf.$$
CONFIG_FILE=`mktemp`

rcd_name=$(jq -r '.name' package.json | sed 's/null//' | sed 's/^@//')
rcd_app_version=$(jq -r '.version' package.json | sed 's/null//')

cat <<EOF > "$CONFIG_FILE"
services:
  registry:
    rpcEndpoint: '${CERC_REGISTRY_RPC_ENDPOINT:-http://testnet-a-2.dev.vaasl.io:26657}'
    gqlEndpoint: '${CERC_REGISTRY_GQL_ENDPOINT:-http://testnet-a-2.dev.vaasl.io:9473/api}'
    chainId: ${CERC_REGISTRY_CHAIN_ID:-laconic-08062024}
    gas: 900000
    fees: 900000alnt
EOF

if [ -z "$CERC_REGISTRY_APP_LRN" ]; then
  authority=$(echo "$rcd_name" | cut -d'/' -f1 | sed 's/@//')
  app=$(echo "$rcd_name" | cut -d'/' -f2-)
  CERC_REGISTRY_APP_LRN="lrn://$authority/applications/$app"
fi

APP_RECORD=$(laconic -c $CONFIG_FILE registry name resolve "$CERC_REGISTRY_APP_LRN" | jq '.[0]')
if [ -z "$APP_RECORD" ] || [ "null" == "$APP_RECORD" ]; then
  echo "No record found for $CERC_REGISTRY_APP_LRN."
  exit 1
fi

MY_ACCOUNT=$(laconic -c $CONFIG_FILE registry account get --user-key "${CERC_REGISTRY_USER_KEY}" | jq -r '.[0].address')

cat <<EOF | sed '/.*: ""$/d' > "$RECORD_FILE"
record:
  type: ApplicationDeploymentRequest
  version: 1.0.0
  name: "$rcd_name@$rcd_app_version"
  application: "$CERC_REGISTRY_APP_LRN@$rcd_app_version"
  dns: "$CERC_REGISTRY_DEPLOYMENT_HOSTNAME"
  deployment: "$CERC_REGISTRY_DEPLOYMENT_LRN"
  to: $MY_ACCOUNT
  config:
    env:
      CERC_WEBAPP_DEBUG: "$rcd_app_version"
      LACONIC_HOSTED_CONFIG_services_wns_server: "$LACONIC_HOSTED_CONFIG_services_wns_server"
      LACONIC_HOSTED_CONFIG_services_wns_webui: "$LACONIC_HOSTED_CONFIG_services_wns_webui"
      LACONIC_HOSTED_CONFIG_services_signal_api: "$LACONIC_HOSTED_CONFIG_services_signal_api"
      LACONIC_HOSTED_CONFIG_app_api_url: "$LACONIC_HOSTED_CONFIG_app_api_url"
  meta:
    note: "Added by CI @ `date`"
    repository: "`git remote get-url origin`"
    repository_ref: "${GITHUB_SHA:-`git log -1 --format="%H"`}"
EOF

cat $RECORD_FILE
RECORD_ID=$(laconic -c $CONFIG_FILE registry record publish --filename $RECORD_FILE --user-key "${CERC_REGISTRY_USER_KEY}" --bond-id ${CERC_REGISTRY_BOND_ID} | jq -r '.id')
echo $RECORD_ID

rm -f $RECORD_FILE $CONFIG_FILE
