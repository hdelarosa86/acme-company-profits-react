const { render } = ReactDOM;
const { Component } = React;
const { HashRouter, Switch, Link, Route, Redirect } = ReactRouterDOM;
const app = document.querySelector('#app');

const Nav = props => {
  const path = props.location.pathname;
  return (
    <nav>
      <Link to="/companies">Companies</Link>
      <Link to="/products">Products</Link>
    </nav>
  );
};

const Navigation = () => {
  return (
    <HashRouter>
      <Route component={Nav} />
      <Switch>
        <Route path="/companies" component={Companies} />
        <Route path="/products" component={Products} />
        <Redirect to="/companies" />
      </Switch>
    </HashRouter>
  );
};


const CompaniesNames = props => {
  if (!props) {
    return (<div>Loading...</div>)
  }
  return (
    <ul>
      {props.companies.map(company => {
        return <li><Link to={`/companies/${company.id}`}>{company.name}</Link></li>
      })}
    </ul>
  );
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      companies: [],
      products : [], 
      offerings: [],
    };
  }
  componentDidMount() {
    Promise.all([
      axios.get('https://acme-users-api-rev.herokuapp.com/api/companies'),
      axios.get('https://acme-users-api-rev.herokuapp.com/api/products'),
      axios.get('https://acme-users-api-rev.herokuapp.com/api/offerings'),
    ])
      .then(responses => responses.map(response => response.data))
      .then( ([companies, products, offerings ])=> this.setState({ companies, products, offerings}));
     
  }
  render() {
    return (
      <HashRouter>
        <Route component={Nav}/>
        <Route path="/companies" render={ () => <CompaniesNames companies={[this.state.companies, [1,2,3]]} /> }/>
        <Route path="/companies/:id" />
      </HashRouter>
    );
  }
}

render(<App />, app);
