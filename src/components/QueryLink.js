//
// Copyright 2020 DXOS.org
//

import React from 'react';

import Link from '@material-ui/core/Link';
import LinkIcon from '@material-ui/icons/ExitToApp';

import { getServiceUrl } from '../util/config';

const QUERY = `
  fragment ValueParts on Value {
    ... on BooleanValue {
      bool: value
    }
    ... on IntValue {
      int: value
    }
    ... on FloatValue {
      float: value
    }
    ... on StringValue {
      string: value
    }
    ... on BytesValue {
      bytes: value
    }
    ... on LinkValue {
      link: value
    }
  }

  fragment AttrParts on Attribute {
    key
    value {
      ...ValueParts
      ... on ArrayValue {
        value {
          ...ValueParts
        }
      }
    }
  }

  {
    getRecordsByIds(ids: ["%ID%"]) {
      id
      names
      bondId
      createTime
      expiryTime
      owners
      attributes {
        ...AttrParts
        value {
          ... on MapValue {
            map: value {
              ...AttrParts
            }
          }
        }
      }
    }
  }
`;

/**
 * Render link to record in WNS.
 * @param {Object} config
 * @param {string} id
 * @param {string} [text]
 * @param {boolean} icon
 */
const QueryLink = ({ config, id, text, icon = false }) => {
  const baseURL = getServiceUrl(config, 'wns.webui');
  const query = QUERY.replace('%ID%', id);

  // NOTE: Playground bug opens two tabs.
  const fullURL = encodeURI(`${baseURL}?query=${query}`);

  return (
    <Link href={fullURL} target='gql'>
      {icon && (
        <LinkIcon />
      )}
      {!icon && (
        text || id
      )}
    </Link>
  );
};

export default QueryLink;
