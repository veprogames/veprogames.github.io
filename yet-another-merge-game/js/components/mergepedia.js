const MERGERS_PER_PAGE = 25;

Vue.component("mergepedia", {
    data() {
        return {
            page: 0
        }
    },
    methods: {
        getMergersPerPage: () => MERGERS_PER_PAGE,
        getMinEntry(page) {
            return MERGERS_PER_PAGE * page - 1;
        },
        getMaxEntry(page) {
            return Math.min(this.highestMergeObject + 1, MERGERS_PER_PAGE + MERGERS_PER_PAGE * page);
        },
        showMerger(level) {
            return level <= this.highestMergeObject;
        },
        getMaxPage() {
            return Math.floor(this.highestMergeObject / MERGERS_PER_PAGE);
        },
        isOnMaxPage() {
            return (this.page) >= Math.floor(this.highestMergeObject / MERGERS_PER_PAGE);
        }
    },
    computed: {
        highestMergeObject() {
            return game.highestMergeObject;
        },
        firstPageEntry() {
            return this.getMinEntry(this.page);
        }
    },
    watch: {
        "highestMergeObject": function (v) {
            this.page = Math.min(this.getMaxPage(), this.page);
        }
    },
    template: `<div class="mergepedia center">
    <button class="with-icon" :disabled="page === 0" @click="page = 0"><img alt="<<" src="images/icons/start.svg"/></button>
    <button class="with-icon" :disabled="page === 0" @click="page = Math.max(0, page - 1)"><img alt="<" src="images/icons/back.svg"/></button>
    <button class="with-icon" :disabled="isOnMaxPage()" @click="page++"><img alt=">" src="images/icons/forward.svg"/></button>
    <button class="with-icon" :disabled="isOnMaxPage()" @click="page = getMaxPage()"><img alt=">>" src="images/icons/end.svg"/></button>
    <p>Page {{page + 1}} / {{getMaxPage() + 1}}</p>
    <div class="flex-start flex-wrap padding-h-xxl">
        <mergepedia-entry v-for="n in getMergersPerPage()" :key="n + firstPageEntry" :level="n + firstPageEntry" v-if="showMerger(n + firstPageEntry)"></mergepedia-entry>
    </div>
</div>`
});