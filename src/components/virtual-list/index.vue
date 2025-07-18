<template>
    <div class="virtual-list" ref="container" @scroll="onScroll">
        <div class="virtual-list__phantom" :style="{ height: phantomHeight + 'px' }"></div>
        <div class="virtual-list__content" :style="{ transform: `translateY(${startOffset}px)` }">
            <div
                v-for="item in visibleData"
                :key="getItemKey(item)"
                class="virtual-list__item"
                :style="{ height: itemHeight + 'px' }"
            >
                <slot :item="item.data" :index="item.index"></slot>
            </div>
        </div>
    </div>
</template>

<script>
/**
 * 虚拟滚动列表组件
 * 用于优化大量数据的渲染性能
 */
export default {
    name: 'virtual-list',
    props: {
        // 列表数据
        items: {
            type: Array,
            required: true
        },
        // 每项高度
        itemHeight: {
            type: Number,
            default: 100
        },
        // 容器高度
        height: {
            type: Number,
            required: true
        },
        // 缓冲区大小（额外渲染的项目数）
        buffer: {
            type: Number,
            default: 5
        },
        // 获取项目唯一键的函数
        keyField: {
            type: String,
            default: 'id'
        }
    },
    data() {
        return {
            scrollTop: 0,
            startIndex: 0,
            endIndex: 0
        };
    },
    computed: {
        // 可见区域可容纳的项目数
        visibleCount() {
            return Math.ceil(this.height / this.itemHeight);
        },
        
        // 总高度
        phantomHeight() {
            return this.items.length * this.itemHeight;
        },
        
        // 开始偏移量
        startOffset() {
            return this.startIndex * this.itemHeight;
        },
        
        // 可见数据
        visibleData() {
            const start = Math.max(0, this.startIndex - this.buffer);
            const end = Math.min(this.items.length, this.endIndex + this.buffer);
            
            return this.items.slice(start, end).map((item, index) => ({
                data: item,
                index: start + index
            }));
        }
    },
    mounted() {
        this.updateVisibleRange();
        this.$refs.container.style.height = this.height + 'px';
    },
    methods: {
        /**
         * 滚动事件处理
         */
        onScroll() {
            const scrollTop = this.$refs.container.scrollTop;
            this.scrollTop = scrollTop;
            this.updateVisibleRange();
            
            // 触发滚动事件
            this.$emit('scroll', {
                scrollTop,
                startIndex: this.startIndex,
                endIndex: this.endIndex
            });
        },
        
        /**
         * 更新可见范围
         */
        updateVisibleRange() {
            const startIndex = Math.floor(this.scrollTop / this.itemHeight);
            const endIndex = Math.min(
                this.items.length - 1,
                startIndex + this.visibleCount
            );
            
            this.startIndex = startIndex;
            this.endIndex = endIndex;
        },
        
        /**
         * 获取项目唯一键
         */
        getItemKey(item) {
            if (typeof this.keyField === 'function') {
                return this.keyField(item.data);
            }
            return item.data[this.keyField] || item.index;
        },
        
        /**
         * 滚动到指定索引
         */
        scrollToIndex(index) {
            const scrollTop = index * this.itemHeight;
            this.$refs.container.scrollTop = scrollTop;
        },
        
        /**
         * 滚动到顶部
         */
        scrollToTop() {
            this.scrollToIndex(0);
        },
        
        /**
         * 滚动到底部
         */
        scrollToBottom() {
            this.scrollToIndex(this.items.length - 1);
        },
        
        /**
         * 获取滚动信息
         */
        getScrollInfo() {
            return {
                scrollTop: this.scrollTop,
                scrollHeight: this.phantomHeight,
                clientHeight: this.height,
                startIndex: this.startIndex,
                endIndex: this.endIndex,
                visibleCount: this.visibleCount
            };
        }
    },
    watch: {
        items() {
            this.updateVisibleRange();
        },
        height() {
            this.$refs.container.style.height = this.height + 'px';
            this.updateVisibleRange();
        }
    }
};
</script>

<style lang="scss" scoped>
.virtual-list {
    position: relative;
    overflow-y: auto;
    
    &__phantom {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        z-index: -1;
    }
    
    &__content {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
    }
    
    &__item {
        box-sizing: border-box;
    }
}
</style>
