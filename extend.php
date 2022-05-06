<?php

/*
 * This file is part of blomstra/user-filter.
 *
 * Copyright (c) 2022 Blomstra Ltd
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

namespace Runig006\TagFilter;

use Flarum\Discussion\Filter\DiscussionFilterer;
use Flarum\Extend;
use Runig006\TagFilter\HideIgnoredFromAllDiscussionsPage;

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__ . '/js/dist/forum.js')
        ->css(__DIR__.'/less/forum.less'),

    (new Extend\Filter(DiscussionFilterer::class))
        ->addFilterMutator(HideIgnoredFromAllDiscussionsPage::class)

];
