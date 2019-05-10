import React from 'react'
import { connect } from 'react-redux'
import { doSort, loadMoviesAction } from '../actions'
import { moviesSelector } from '../store'

function MovieRow({ movie, fields }) {
  return (
    <tr>
      { fields.map(field => <td key={movie[field]}>{movie[field]}</td>) }
    </tr>
  );
}

function SortIcon() {
  return (
    <span className="icon">
      <i className="fas fa-sort-down"></i>
    </span>
  )
}

function ColumnHeader({ name, sorted, onClick }) {
  return (
    <td onClick={onClick}>{ name } { sorted ? <SortIcon /> : null }</td>
  );  
}

function MovieTable({ loading, movies, sortField, onSort }) {
  let createColumnHeader = (field) => (
    <ColumnHeader name={field} sorted={sortField === field} onClick={() => onSort(field)} key={field} />
  );
  let fields = ['Title', 'Genre', 'Rating'];

  return (
      <table className="table is-fullwidth">
        <thead>
          <tr>
            { fields.map((fieldName) => createColumnHeader(fieldName)) }
          </tr>
        </thead>
        <tbody>
          { loading ? <tr><td>Loading...</td></tr> : movies.map((movie) => <MovieRow movie={movie} key={movie['Title']} fields={fields}/>) }
        </tbody>
      </table>
  );
}

class MovieTableWrapper extends React.Component {
  shouldComponentUpdate(newProps, newState) {
    if (this.props.movies === newProps.movies && 
        this.props.sortField === newProps.sortField && 
        this.props.loading === newProps.loading) {
      return false;
    }
    return true;
  }

  componentDidMount() {
    this.props.onInit();
  }

  render() {
    return <MovieTable {...this.props} />
  }
}

export default connect((state, ownProps) => ({
  sortField: state.sortField,
  loading: state.loading
}), (dispatch) => ({
  onSort: (column) => dispatch(doSort(column)),
  onInit: () => dispatch(loadMoviesAction())
}))(MovieTableWrapper);

