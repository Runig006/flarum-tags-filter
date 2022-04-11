import Component from 'flarum/common/Component';
import Button from 'flarum/common/components/Button';
import Dropdown from 'flarum/common/components/Dropdown';
import app from 'flarum/forum/app';

import type Mithril from 'mithril';

import Tag from 'flarum/tags/models/Tag';

interface IAttrs {}

interface IState {
  data: Tag[];
  selected: Array;
}

export default class TagsDropdown extends Component<IAttrs, IState> {
  oninit(vnode: Mithril.Vnode<IAttrs, this>): void {
    super.oninit(vnode);
    this.state = {
      data: app.store.all('tags').filter(tag => !tag.parent()),
      selected: app.search.params().tags ? app.search.params().tags.split(',') : [],
    };
  }

  view() {
    let content = this.state.data?.map((tag) => (
      <Button  className={`TagFilter-item Button ${this.state.selected.indexOf(tag.slug()) >= 0 ? "active" : ""}`}
        onclick={() => {
          this.handleTagChange(tag);
        }}
      >
        {tag.name()}
      </Button>
    ));

    return (
      <Dropdown
        buttonClassName="Button"
        label="Tags"
        updateOnClose
      >
       {content}
      </Dropdown>
    );
  }

  handleTagChange(tag: Tag | null) {
    let params = app.search.params();
    let index = this.state.selected.indexOf(tag.slug());
    if(index >= 0){
      this.state.selected.splice(index,1);
    }else{
      this.state.selected.push(tag.slug());
    }
    params.tags = this.state.selected.join(',');
    app.discussions.refreshParams(params, 2);
  }
}
