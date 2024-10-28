import {
  useState, useEffect,
} from 'react';
import { PropTypes } from 'prop-types';
import {
  Grid,
  GridColumn,
  Segment,
  Dropdown,
  Header,
  Table,
  TableRow,
  TableHeaderCell,
  TableHeader,
  Input,
  TableCell,
  TableBody,
  Icon,
  Button,
} from 'semantic-ui-react';

import findFrequentBuyers from './find-frequent-buyers.js';

const CATEGORY_OPTIONS = [
  {
    key: 1,
    text: 'Food',
    value: 'food',
  },
  {
    key: 2,
    text: 'Travel',
    value: 'travel',
  },
  {
    key: 3,
    text: 'Home',
    value: 'home',
  },
  {
    key: 4,
    text: 'Entertainment',
    value: 'entertainment',
  },
  {
    key: 5,
    text: 'Clothing',
    value: 'clothing',
  },
  {
    key: 6,
    text: 'Health',
    value: 'health',
  },
  {
    key: 7,
    text: 'Other',
    value: 'other',
  },
];

const FrequentBuyers = ({ purchases }) => {
  const [ minPurchases, setMinPurchases ] = useState(2);
  const [ selectedCategory, setSelectedCategory ] = useState(CATEGORY_OPTIONS[0].value);
  const [ sortedColumn, setSortedColumn ] = useState(null);
  const [ sortDirection, setSortDirection ] = useState(null);
  const [ displayLimit, setDisplayLimit ] = useState(50);
  const [ currentPage, setCurrentPage ] = useState(0);

  const frequentBuyers = findFrequentBuyers(purchases, selectedCategory, minPurchases);
  const startIndex = currentPage * displayLimit;
  const endIndex = startIndex + displayLimit;
  const displayedBuyers = frequentBuyers.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(0);
    setDisplayLimit((current) => current);
  }, [ minPurchases, selectedCategory ]);

  return (
    <>
      <Grid columns={3}>
        <GridColumn verticalAlign='middle'>
          <Header
            as='h3'
            content={`Frequent Buyers (${frequentBuyers.length})`}
            icon='shop'
          />
        </GridColumn>
        <GridColumn>
          Category:
          <Dropdown
            fluid
            search
            selection
            defaultValue={selectedCategory}
            options={CATEGORY_OPTIONS}
            placeholder='Select a Category'
            onChange={(e, { value }) => setSelectedCategory(value)}
          />
        </GridColumn>
        <GridColumn>
          Minimum Purchases:
          <br />
          <Input
            fluid
            defaultValue={minPurchases}
            min={1}
            type='number'
            onChange={(e) => setMinPurchases(e.target.value)}
          />
        </GridColumn>
      </Grid>
      {!displayedBuyers.length && (
        <Segment placeholder>
          <Header icon>
            <Icon name='warning circle' />
            There are no frequent buyers that match your criteria.
          </Header>
        </Segment>
      )}
      {!!displayedBuyers.length && (
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
                  sorted={sortedColumn === 'purchaseCount' ? sortDirection : null}
                  onClick={() => {
                    setSortedColumn('purchaseCount');
                    setSortDirection(
                      sortedColumn === 'purchaseCount' && sortDirection === 'ascending'
                        ? 'descending'
                        : 'ascending',
                    );
                  }}
                >
                  Purchase Count
                </TableHeaderCell>
                <TableHeaderCell
                  sorted={sortedColumn === 'totalAmount' ? sortDirection : null}
                  onClick={() => {
                    setSortedColumn('totalAmount');
                    setSortDirection(
                      sortedColumn === 'totalAmount' && sortDirection === 'ascending'
                        ? 'descending'
                        : 'ascending',
                    );
                  }}
                >
                  Total Amount
                </TableHeaderCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedBuyers.map((buyer) => (
                <TableRow key={buyer.customerId}>
                  <TableCell>{buyer.customerId}</TableCell>
                  <TableCell>{buyer.count}</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    }).format(buyer.totalAmount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div style={{
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
              disabled={endIndex >= frequentBuyers.length}
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

FrequentBuyers.propTypes = {
  purchases: PropTypes.arrayOf(
    PropTypes.shape({
      amount: PropTypes.number.isRequired,
      category: PropTypes.string.isRequired,
      customerId: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default FrequentBuyers;
