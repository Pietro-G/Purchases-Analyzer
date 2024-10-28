import { useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import {
  Segment,
  Header,
  Table,
  TableRow,
  TableHeaderCell,
  TableHeader,
  TableCell,
  TableBody,
  Icon,
  List,
  Button,
} from 'semantic-ui-react';

import findSuspiciousPurchases from './find-suspicious-purchases.js';

const SuspiciousPurchases = ({ purchases }) => {
  const [ sortedColumn, setSortedColumn ] = useState(null);
  const [ sortDirection, setSortDirection ] = useState(null);
  const [ displayLimit, setDisplayLimit ] = useState(50);
  const [ currentPage, setCurrentPage ] = useState(0);

  const suspiciousPurchases = findSuspiciousPurchases(purchases);
  const startIndex = currentPage * displayLimit;
  const endIndex = startIndex + displayLimit;
  const displayedPurchases = suspiciousPurchases.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(0);
    setDisplayLimit((current) => current);
  }, [ purchases ]);

  return (
    <>
      <Header
        as='h3'
        content={`Suspicious Purchases (${suspiciousPurchases.length})`}
        icon='spy'
        style={{
          marginTop: 15,
          marginBottom: 25,
        }}
      />
      {!displayedPurchases.length && (
        <Segment placeholder>
          <Header icon>
            <Icon
              color='green'
              name='check circle'
            />
            There are no suspicious purchases found.
          </Header>
        </Segment>
      )}
      {!!displayedPurchases.length && (
        <>
          <Table
            celled
            sortable
          >
            <TableHeader>
              <TableRow>
                <TableHeaderCell
                  sorted={sortedColumn === 'customerId' ? sortDirection : null}
                  onClick={() => {
                    setSortedColumn('customerId');
                    setSortDirection(
                      sortedColumn === 'customerId' && sortDirection === 'ascending'
                        ? 'descending'
                        : 'ascending',
                    );
                  }}
                >
                  Customer ID
                </TableHeaderCell>
                <TableHeaderCell
                  sorted={sortedColumn === 'category' ? sortDirection : null}
                  onClick={() => {
                    setSortedColumn('category');
                    setSortDirection(
                      sortedColumn === 'category' && sortDirection === 'ascending'
                        ? 'descending'
                        : 'ascending',
                    );
                  }}
                >
                  Category
                </TableHeaderCell>
                <TableHeaderCell
                  sorted={sortedColumn === 'amount' ? sortDirection : null}
                  onClick={() => {
                    setSortedColumn('amount');
                    setSortDirection(
                      sortedColumn === 'amount' && sortDirection === 'ascending'
                        ? 'descending'
                        : 'ascending',
                    );
                  }}
                >
                  Amount
                </TableHeaderCell>
                <TableHeaderCell>Reason</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedPurchases.map((purchase) => (
                <TableRow key={purchase.id}>
                  <TableCell>{purchase.customerId}</TableCell>
                  <TableCell>{purchase.category}</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    }).format(purchase.amount)}
                  </TableCell>
                  <TableCell>
                    <List>
                      {purchase.suspiciousReasons.map((reason) => (
                        <List.Item key={`${purchase.id}-${reason}`}>{reason}</List.Item>
                      ))}
                    </List>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div
            style={{
              marginTop: '20px',
              textAlign: 'center',
            }}
          >
            <Button
              disabled={currentPage === 0}
              onClick={() => setCurrentPage((prevPage) => Math.max(prevPage - 1, 0))}
            >
              Previous
            </Button>
            <Button
              disabled={endIndex >= suspiciousPurchases.length}
              onClick={() => setCurrentPage((prevPage) => prevPage + 1)}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </>
  );
};

SuspiciousPurchases.propTypes = {
  purchases: PropTypes.arrayOf(
    PropTypes.shape({
      amount: PropTypes.number.isRequired,
      category: PropTypes.string.isRequired,
      customerId: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      suspiciousReasons: PropTypes.arrayOf(PropTypes.string),
    }),
  ).isRequired,
};

export default SuspiciousPurchases;
