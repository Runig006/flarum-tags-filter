import { extend } from 'flarum/common/extend';
import app from 'flarum/forum/app';
import IndexPage from 'flarum/forum/components/IndexPage';
import Page from 'flarum/forum/components/Page';
import TagsDropdown from './components/TagsDropdown';
import GlobalSearchState from 'flarum/forum/states/GlobalSearchState';

export function getSelected() {
  let saved = localStorage.getItem('spy-tags-filters');
  let selected = [];
  if (saved) {
    selected = JSON.parse(saved);
  } else {
    selected = [];
  }
  return selected;
}

export function refreshTags() {
  let params = app.search.params();
  let selected = getSelected();
  if (selected.length > 0) {
    params.tag = selected.join(',');
  } else {
    params.tag = null;
    delete params.tag;
  }
  app.discussions.refreshParams(params, 2);
}

app.initializers.add('runig006/user-filter', () => {
  extend(IndexPage.prototype, 'viewItems', function (items) {
    let array = ['index', 'following'];
    if (array.indexOf(app.current.data.routeName) == -1) {
      return
    };
    items.add('filter-tags', <TagsDropdown />);
  });

  extend(IndexPage.prototype, 'oninit', function (items) {
    if (app.previous.type == null) {
      refreshTags();
    }
  });

  extend(GlobalSearchState.prototype, 'params', function (params) {
    let selected = getSelected();
    if (params.filter == null) {
      params.filter = {};
    }
    if (selected.length > 0) {
      params.filter.tag = selected.join(',');
    }
  });
});
