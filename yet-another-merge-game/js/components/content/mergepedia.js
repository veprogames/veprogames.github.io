const MERGERS_PER_PAGE = 10;

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
    mounted(){
        this.page = this.getMaxPage();
    },
    template: `<div class="mergepedia center">
    <div class="navigation flex-center-center">
        <button :disabled="page === 0" @click="page = 0"><i class="fas fa-angle-double-left"></i></button>
        <button :disabled="page === 0" @click="page = Math.max(0, page - 1)"><i class="fas fa-angle-left"></i></button>
        <button :disabled="isOnMaxPage()" @click="page++"><i class="fas fa-angle-right"></i></button>
        <button :disabled="isOnMaxPage()" @click="page = getMaxPage()"><i class="fas fa-angle-double-right"></i></button>
        <span class="page-number margin-h">Page {{page + 1 | ftnum}} / {{getMaxPage() + 1 | ftnum}}</span>
    </div>
    <table class="padding-h-xxl">
        <tr>
            <th>Merger</th>
            <th>Production</th>
            <th>Base Production</th>
        </tr>
        <mergepedia-entry v-for="n in getMergersPerPage()" :key="n + firstPageEntry" :level="n + firstPageEntry" v-if="showMerger(n + firstPageEntry)"></mergepedia-entry>
    </table>
</div>`
});