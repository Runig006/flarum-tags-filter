import Component from 'flarum/common/Component';
import Button from 'flarum/common/components/Button';
import Dropdown from 'flarum/common/components/Dropdown';
import app from 'flarum/forum/app';
import ItemList from 'flarum/common/utils/ItemList';
import { getSelected, refreshTags } from '../index.js';

export default class TagsDropdown extends Dropdown {
    static initAttrs(attrs) {
        super.initAttrs(attrs);
        attrs.label = "Tags";
        attrs.className = 'TagFilter';
        attrs.buttonClassName = 'TagFilter-item Button';
        attrs.menuClassName = 'Dropdown-menu--right';
    }

    view(vnode) {
        return super.view({ ...vnode, children: this.items().toArray() });
    }

    items() {
        let selected = getSelected();
        const tags = app.store.all('tags');
        const items = new ItemList();
        const t = this;
        tags.forEach(tag => {
            let cl = 'Button';
            if (selected.indexOf(tag.slug()) >= 0) {
                cl += ' active';
            }
            items.add(
                tag.slug(),
                Button.component(
                    {
                        class: cl,
                        onclick() {
                            t.handleTagChange(tag)
                        },
                    },
                    tag.name()
                ),
            );
        });
        return items;
    }

    handleTagChange(tag) {
        let selected = getSelected();
        let index = selected.indexOf(tag.slug());
        if (index >= 0) {
            selected.splice(index, 1);
        } else {
            selected.push(tag.slug());
        }
        localStorage.setItem('spy-tags-filters', JSON.stringify(selected));
        refreshTags();
    }
}