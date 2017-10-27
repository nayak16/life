import React, { Component } from 'react';
import './App.css';


class FilterSection extends Component {
  render() {
    return (
      <form>
        <input type="text" onInput={e => this.props.onInput(e.target.value)} placeholder="Search..."></input>
        <p>
        <label><input name="Checkbox1" type="checkbox" onClick={e => this.props.onCheckboxChange(e.target.checked)}/>In Stock Only</label>
        </p>
      </form>
    )
  }
}

class CategoryHeader extends Component {
  render() {
    return (
      <tr>
        <th colSpan="2">
          {this.props.category}
        </th>
      </tr>
    )
  }
}

class ProductRow extends Component {
  render() {
    const product = this.props.product
    const name = product.stocked ? 
      product.name :
      <span style={{color: 'red'}}>
        {product.name}
      </span>

    return (
      <tr>
        <td>
          {name}
        </td>
        <td>
          {product.price}
        </td>
      </tr>
    )
  }
}


class ProductTable extends Component {
  render() {
    var headers = {}

    this.props.products.forEach((product) => {
      var filter = this.props.filterText
      console.log(this.props.inStockOnly)
      if (!this.props.inStockOnly || (this.props.inStockOnly && product.stocked)) {
        if (filter == '' || product.name.indexOf(filter) != -1) {
          if (!(product.category in headers)) {
            headers[product.category] = []
            headers[product.category].push(
              <CategoryHeader category={product.category} />
            )
          }
          headers[product.category].push(
            <ProductRow product={product} />
          )
        }
      }
    });
    var rows = []
    for (let cat in headers) {
      headers[cat].forEach((row) => {
        rows.push(row)
      })
    }
    return (
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    )
  }
}

class FilterableProductTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterText: '',
      inStockOnly: false
    }
    this._onInputChange = this.onInputChange.bind(this)
    this._onCheckboxChange = this.onCheckboxChange.bind(this)
  }

  onInputChange(newValue) {
    this.setState({
      filterText: newValue
    })
  }

  onCheckboxChange(newValue) {
    this.setState({
      inStockOnly: newValue
    })
  }

  render() {
    return (<div>
      <FilterSection 
        filterText={this.state.filterText}
        inStockOnly={this.state.inStockOnly}
        onInput={this._onInputChange}
        onCheckboxChange={this._onCheckboxChange}/>

      <ProductTable products={this.props.products} filterText={this.state.filterText} inStockOnly={this.state.inStockOnly}></ProductTable>
      </div>
    )
  }

}

class App extends Component {
  constructor() {
    super()
    this.state = {
      serverProducts: []
    }
  }

  componentDidMount() {
    fetch("/products.json")
      .then(res => res.json())
      .then(products => {
        return this.setState({ serverProducts: products.products })
      })
  }

  render() {
    return (
      <FilterableProductTable products={this.state.serverProducts} />
    );
  }
}

export default App;
