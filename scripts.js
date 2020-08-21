/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-key */
/* eslint-disable react/no-multi-comp */
/* eslint-disable react/react-in-jsx-scope */
const { render } = ReactDOM;
const { Component } = React;
const { HashRouter, Switch, Link, Route, Redirect } = ReactRouterDOM;
const app = document.querySelector('#app');

const Nav = ({ pathname, companies }) => {
  const path = pathname;
  return (
    <nav>
      <Link to="/" className={path === '/' ? 'selected' : ''}>
        Acme Company Profits with React Router
      </Link>
      <Link
        to="/companies"
        className={path.startsWith('/companies') ? 'selected' : ''}
      >
        {`Companies (${companies.length})`}
      </Link>
    </nav>
  );
};

const Home = () => (
  <div className="home">
    <h1>Welcome!</h1>
  </div>
);

const CompaniesList = ({ companies, match }) => {
  if (!companies) {
    return <div>Loading...</div>;
  }
  const path = match.params.id;
  return (
    <div className="company-card">
      <ul className="companies">
        {companies.map((company, idx) => {
          return (
            <li>
              <Link
                key={idx}
                to={`/companies/${company.id}`}
                className={path === company.id ? 'selected' : ''}
              >
                {company.name}
              </Link>
            </li>
          );
        })}
      </ul>
      <Route
        path="/companies/:id"
        render={(props) => <CompanyProfitList {...props} />}
      />
    </div>
  );
};

class CompanyProfitList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profits: [],
      isError: false,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      const { id } = this.props.match.params;
      axios
        .get(
          `https://acme-users-api-rev.herokuapp.com/api/companies/${id}/companyProfits`
        )

        .then(({ data }) => {
          const profits = data;
          this.setState({ profits, isError: false });
        })
        .catch((e) => {
          this.setState({ profits: [], isError: true });
        });
    }
  }
  componentDidMount() {
    const { id } = this.props.match.params;
    axios
      .get(
        `https://acme-users-api-rev.herokuapp.com/api/companies/${id}/companyProfits`
      )
      .then((response) => {
        const profits = response.data;
        this.setState({ profits });
      })
      .catch((e) => {
        this.setState({ profits: [] });
      });
  }

  render() {
    const { profits, isError } = this.state;
    if (isError) return <h3>Company not found</h3>;
    return (
      <ul className="profits">
        {profits.map((profit) => (
          <li>
            <div>
              <p>
                <span className="fiscal-year">
                  {profit.fiscalYear.slice(0, 4)}
                </span>{' '}
                <span>${profit.amount.toFixed(2)}</span>
              </p>
            </div>
          </li>
        ))}
      </ul>
    );
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      companies: [],
    };
  }
  componentDidMount() {
    axios
      .get('https://acme-users-api-rev.herokuapp.com/api/companies')
      .then((response) => {
        const companies = response.data;
        this.setState({ companies });
      });
  }
  render() {
    const { companies } = this.state;
    return (
      <HashRouter>
        <Route
          render={({ location }) => (
            <Nav pathname={location.pathname} companies={companies} />
          )}
        />
        <Switch>
          <Route
            path="/companies/:id?"
            render={({ match }) => (
              <CompaniesList match={match} companies={companies} />
            )}
          />
          <Route path="/" render={() => <Home />} />
          <Redirect to="/" />
        </Switch>
      </HashRouter>
    );
  }
}

render(<App />, app);
