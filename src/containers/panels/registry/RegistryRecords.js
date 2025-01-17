//
// Copyright 2020 DXOS.org
//

import moment from 'moment';
import React, { useContext, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { makeStyles } from '@material-ui/core';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TablePagination from '@material-ui/core/TablePagination';
import { Paper, TableContainer, } from '@material-ui/core';

import WNS_RECORDS from '../../../gql/wns_records.graphql';

import { ConsoleContext, useQueryStatusReducer, useSorter } from '../../../hooks';

import Table from '../../../components/Table';
import TableCell from '../../../components/TableCell';

import PackageLink from '../../../components/PackageLink';
import QueryLink from '../../../components/QueryLink';
import AppLink from '../../../components/AppLink';

const useStyles = makeStyles(theme => ({
  selected: {
    color: theme.palette.text.primary
  }
}));

const types = [
  { key: null, label: 'ALL' },
  { key: 'lrn:kube', label: 'Kube' },
  { key: 'lrn:service', label: 'Service' },
  { key: 'lrn:app', label: 'App' },
  { key: 'lrn:bot', label: 'Bot' },
  { key: 'lrn:bot-factory', label: 'Bot Factory' },
  { key: 'lrn:file', label: 'File' },
  { key: 'lrn:type', label: 'Type' }
];

export const RecordType = ({ type = types[0].key, onChange }) => {
  const classes = useStyles();

  return (
    <ButtonGroup
      disableRipple
      disableFocusRipple
      variant='outlined'
      color='primary'
      size='small'
      aria-label='text primary button group'
    >
      {types.map(t => (
        <Button
          key={t.key}
          className={t.key === type && classes.selected}
          onClick={() => onChange(t.key)}
        >
          {t.label}
        </Button>
      ))}
    </ButtonGroup>
  );
};

const RegistryRecords = ({ type }) => {
  const { config } = useContext(ConsoleContext);
  const [sorter, sortBy] = useSorter('createTime', false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const offset = page * rowsPerPage;

  const { data, refetch } = useQueryStatusReducer(useQuery(WNS_RECORDS, {
    pollInterval: config.api.intervalQuery,
    variables: { attributes: { type, limit: rowsPerPage, offset: offset } }
  }));

  if (!data) {
    return null;
  }

  const records = JSON.parse(data.wns_records.json);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    const offset = newPage * rowsPerPage;
    refetch({ attributes: { type, limit: rowsPerPage, offset } });
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    refetch({ attributes: { type, limit: newRowsPerPage, offset: 0 } });
  };

  const labelDisplayedRows = ({ from, to }) => {
    if (rowsPerPage > records.length) {
      return `${from}-${from + records.length - 1}`;
    } else {
      return `${from}-${to}`;
    }
  };

  return (
    <Paper style={{
      width: '100%',
    }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell onClick={sortBy('attributes.type')} size='medium'>Type</TableCell>
              <TableCell onClick={sortBy('names[0]')}>Registered Names</TableCell>
              <TableCell onClick={sortBy('attributes.version')} size='small'>Version</TableCell>
              <TableCell onClick={sortBy('attributes.name')}>Display Name</TableCell>
              <TableCell onClick={sortBy('createTime')} size='small'>Created</TableCell>
              <TableCell onClick={sortBy('attributes.package')}>Package</TableCell>
              <TableCell size='icon' />
            </TableRow>
          </TableHead>
          <TableBody>
            {records.sort(sorter).map((record) => {
              const { id, names, createTime, attributes: { type, name: displayName, fileName, version, description, service, package: pkg } } = record;

              let pkgLink;
              let appLinks;

              if (pkg) {
                pkgLink = (<PackageLink config={config} type={type} pkg={pkg} />);
              }

              if (type === 'lrn:app') {
                appLinks = (
                  <>
                    {(names || []).map(lrn =>
                      <div key={lrn}>
                        <AppLink config={config} lrn={lrn} />
                      </div>
                    )}
                  </>
                );
              }

              return (
                <TableRow key={id} size='small'>
                  <TableCell monospace>{type}</TableCell>
                  <TableCell monospace>
                    {appLinks || (names || []).map(name => <div key={name}>{name}</div>)}
                  </TableCell>
                  <TableCell monospace>{version}</TableCell>
                  <TableCell>{displayName || service || fileName || description}</TableCell>
                  <TableCell>{moment.utc(createTime).fromNow()}</TableCell>
                  <TableCell monospace>{pkgLink}</TableCell>
                  <TableCell>
                    <QueryLink config={config} id={id} icon />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="td"
        rowsPerPageOptions={[5, 10, 25]}
        count={-1}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelDisplayedRows={labelDisplayedRows}
        nextIconButtonProps={{
          disabled: records.length < rowsPerPage,
        }}
      />
    </Paper>
  );
};

export default RegistryRecords;
