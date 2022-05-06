<?php

/*
 * This file is part of Flarum.
 *
 * For detailed copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace Runig006\TagFilter;

use Flarum\Filter\FilterState;
use Flarum\Query\QueryCriteria;
use Flarum\Tags\Query\TagFilterGambit;

class HideIgnoredFromAllDiscussionsPage
{
    public function __invoke(FilterState $filterState, QueryCriteria $criteria)
    {
        // We only want to hide on the "all discussions" page.
        $count = $filterState->getActiveFilters();
        $count = array_filter($count, function($t){
            return ! $t instanceof TagFilterGambit;
        });
        if (count($count) === 0) {
            // TODO: might be better as `id IN (subquery)`?
            $actor = $filterState->getActor();
            $filterState->getQuery()->whereNotExists(function ($query) use ($actor) {
                $query->selectRaw(1)
                    ->from('discussion_user')
                    ->whereColumn('discussions.id', 'discussion_id')
                    ->where('user_id', $actor->id)
                    ->where('subscription', 'ignore');
            });
        }
    }
}
