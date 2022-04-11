import { extend } from 'flarum/common/extend';
import ItemList from 'flarum/common/utils/ItemList';
import app from 'flarum/forum/app';
import IndexPage from 'flarum/forum/components/IndexPage';

import TagsDropdown from './components/TagsDropdown';

import type Mithril from 'mithril';

app.initializers.add('runig006/user-filter', () => {
  extend(IndexPage.prototype, 'viewItems', function (items: ItemList<Mithril.Children>) {
    let array = ['index', 'following'];
    if (array.indexOf(app.current.data.routeName) == -1) { 
      return 
    };
    items.add('tagFilter', <TagsDropdown />, -15);
  });
});
