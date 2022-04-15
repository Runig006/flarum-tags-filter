import Component from 'flarum/common/Component';
import Button from 'flarum/common/components/Button';
import Dropdown from 'flarum/common/components/Dropdown';
import app from 'flarum/forum/app';

import type Mithril from 'mithril';

import Tag from 'flarum/tags/models/Tag';

interface IAttrs { }

interface IState {
  data: Tag[];
  selected: Array;
}

export default class TagsDropdown extends Component<IAttrs, IState> {
  oninit(vnode: Mithril.Vnode<IAttrs, this>): void {
    super.oninit(vnode);
    let selected = [];
    let saved = localStorage.getItem('spy-tags-filters');
    if (saved) {
      selected = JSON.parse(saved);
    } else {
      selected = [];
    }
    this.state = {
      data: sortTags(app.store.all('tags')),
      selected: selected
    };
  }

  view() {
    let content = this.state.data?.map((tag) => (
      <Button className={`TagFilter-item Button ${this.state.selected.indexOf(tag.slug()) >= 0 ? "active" : ""}`}
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
    if (index >= 0) {
      this.state.selected.splice(index, 1);
    } else {
      this.state.selected.push(tag.slug());
    }
    localStorage.setItem('spy-tags-filters', JSON.stringify(this.state.selected));
    params.tags = this.state.selected.join(',');
    app.discussions.refreshParams(params, 2);
  }
}


//Is from Common Sorts Tags, but the fucker doesnt export it
function sortTags(tags) {
  return tags.slice(0).sort((a, b) => {
    const aPos = a.position();
    const bPos = b.position();

    // If they're both secondary tags, sort them by their discussions count,
    // descending.
    if (aPos === null && bPos === null)
      return b.discussionCount() - a.discussionCount();

    // If just one is a secondary tag, then the primary tag should
    // come first.
    if (bPos === null) return -1;
    if (aPos === null) return 1;

    // If we've made it this far, we know they're both primary tags. So we'll
    // need to see if they have parents.
    const aParent = a.parent();
    const bParent = b.parent();

    // If they both have the same parent, then their positions are local,
    // so we can compare them directly.
    if (aParent === bParent) return aPos - bPos;

    // If they are both child tags, then we will compare the positions of their
    // parents.
    else if (aParent && bParent)
      return aParent.position() - bParent.position();

    // If we are comparing a child tag with its parent, then we let the parent
    // come first. If we are comparing an unrelated parent/child, then we
    // compare both of the parents.
    else if (aParent)
      return aParent === b ? 1 : aParent.position() - bPos;

    else if (bParent)
      return bParent === a ? -1 : aPos - bParent.position();

    return 0;
  });
}