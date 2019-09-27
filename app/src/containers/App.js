import React, { Component } from 'react';
import Proptypes from 'prop-types';
import { connect } from 'react-redux';
import {
  selectedSubreddit,
  fetchPostsIfNeeded,
  invalidateSubreddit
} from "../actions";
import Picker from "../components/Picker";
import Posts from "../components/Posts";

class App extends Component {
  static propTypes = {
    selectedSubreddit: Proptypes.string.isRequired,
    posts: Proptypes.array.isRequired,
    isFetching: Proptypes.bool.isRequired,
    lastUpdated: Proptypes.number,
    dispatch: Proptypes.func.isRequired
  };

  componentDidMount() {
    const { dispatch, selectedSubreddit } = this.props;
    dispatch(fetchPostsIfNeeded(selectedSubreddit));
  }

  componentDidUpdate(prevProps) {
    if(prevProps.selectedSubreddit !== this.props.selectedSubreddit) {
      const { dispatch, selectedSubreddit } = this.props;
      dispatch(fetchPostsIfNeeded(selectedSubreddit));
    }
  }

  handleChange = nextSubreddit => {
    this.props.dispatch(selectedSubreddit(nextSubreddit));
  };

  handleRefreshClick = e => {
    e.preventDefault();

    const{ dispatch, selectedSubreddit } = this.props;
    dispatch(invalidateSubreddit(selectedSubreddit));
    dispatch(fetchPostsIfNeeded(selectedSubreddit));
  };

  render() {
    const { selectedSubreddit, posts, isFetching, lastUpdated } = this.props;
    const isEmpty = posts.length === 0;
    return(
      <div>
        <Picker
          value ={selectedSubreddit}
          onChange = {this.handleChange}
          options = {["reactjs", "frontend", "programmerHumor"]}
        />
        <p>
          {lastUpdated && (
            <span>
              Last updooted at {new Date(lastUpdated).toLocaleTimeString}.{" "}
            </span>
          )}
          {!isFetching && (
            <button onClick = {this.handleRefreshClick}>ReDoot</button>
          )}
        </p>
        {isEmpty ? (
          isFetching ? (
            <h2>Loading...</h2>
          ) : (
            <h2>Empty...bummer.</h2>
          )
        ) : (
          <div style={{ opacity: isFetching ? 0.5 : 1 }}>
            <Posts posts={posts} />
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { selectedSubreddit, postsBySubreddit } = state;
  const { isFetching, lastUpdated, items: posts } = postsBySubreddit[
    selectedSubreddit
  ] || {
    isFetching: true,
    item: []
  };

  return {
    selectedSubreddit,
    posts,
    isFetching,
    lastUpdated
  };
}

export default connect(mapStateToProps)(App);