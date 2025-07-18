<template>
    <div class="lazy-image" :class="{ 'lazy-image--loaded': loaded, 'lazy-image--error': error }">
        <img
            v-if="shouldLoad"
            :src="currentSrc"
            :alt="alt"
            :class="imgClass"
            @load="onLoad"
            @error="onError"
            ref="img"
        />
        <div v-else-if="!loaded && !error" class="lazy-image__placeholder">
            <slot name="placeholder">
                <div class="lazy-image__skeleton"></div>
            </slot>
        </div>
        <div v-else-if="error" class="lazy-image__error">
            <slot name="error">
                <div class="lazy-image__error-content">
                    <i class="el-icon-picture-outline"></i>
                    <span>{{ errorText || '图片加载失败' }}</span>
                </div>
            </slot>
        </div>
    </div>
</template>

<script>
/**
 * 懒加载图片组件
 * 支持Intersection Observer API和fallback方案
 */
export default {
    name: 'lazy-image',
    props: {
        // 图片源地址
        src: {
            type: String,
            required: true
        },
        // 占位图片
        placeholder: {
            type: String,
            default: ''
        },
        // 图片alt属性
        alt: {
            type: String,
            default: ''
        },
        // 图片class
        imgClass: {
            type: String,
            default: ''
        },
        // 错误提示文本
        errorText: {
            type: String,
            default: ''
        },
        // 懒加载阈值
        threshold: {
            type: Number,
            default: 0.1
        },
        // 根边距
        rootMargin: {
            type: String,
            default: '50px'
        },
        // 是否立即加载
        immediate: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            loaded: false,
            error: false,
            shouldLoad: false,
            currentSrc: '',
            observer: null
        };
    },
    mounted() {
        if (this.immediate) {
            this.loadImage();
        } else {
            this.initObserver();
        }
    },
    beforeDestroy() {
        this.destroyObserver();
    },
    methods: {
        /**
         * 初始化Intersection Observer
         */
        initObserver() {
            if (!window.IntersectionObserver) {
                // 不支持Intersection Observer，直接加载
                this.loadImage();
                return;
            }

            this.observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            this.loadImage();
                            this.destroyObserver();
                        }
                    });
                },
                {
                    threshold: this.threshold,
                    rootMargin: this.rootMargin
                }
            );

            this.observer.observe(this.$el);
        },

        /**
         * 销毁Observer
         */
        destroyObserver() {
            if (this.observer) {
                this.observer.disconnect();
                this.observer = null;
            }
        },

        /**
         * 加载图片
         */
        loadImage() {
            if (this.shouldLoad) return;
            
            this.shouldLoad = true;
            this.currentSrc = this.src;
        },

        /**
         * 图片加载成功
         */
        onLoad() {
            this.loaded = true;
            this.error = false;
            this.$emit('load', this.$refs.img);
        },

        /**
         * 图片加载失败
         */
        onError() {
            this.error = true;
            this.loaded = false;
            
            // 如果有占位图，尝试加载占位图
            if (this.placeholder && this.currentSrc !== this.placeholder) {
                this.currentSrc = this.placeholder;
                return;
            }
            
            this.$emit('error', new Error('Image load failed'));
        },

        /**
         * 重新加载图片
         */
        reload() {
            this.loaded = false;
            this.error = false;
            this.shouldLoad = false;
            this.currentSrc = '';
            
            this.$nextTick(() => {
                this.loadImage();
            });
        }
    },
    watch: {
        src(newSrc) {
            if (newSrc !== this.currentSrc) {
                this.reload();
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.lazy-image {
    position: relative;
    display: inline-block;
    overflow: hidden;
    
    &__placeholder,
    &__error {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        min-height: 100px;
    }
    
    &__skeleton {
        width: 100%;
        height: 100%;
        background: linear-gradient(
            90deg,
            #f0f0f0 25%,
            #e0e0e0 50%,
            #f0f0f0 75%
        );
        background-size: 200% 100%;
        animation: skeleton-loading 1.5s infinite;
    }
    
    &__error {
        background-color: #f5f5f5;
        color: #999;
        
        &-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            
            i {
                font-size: 24px;
            }
            
            span {
                font-size: 12px;
            }
        }
    }
    
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: opacity 0.3s ease;
        opacity: 0;
    }
    
    &--loaded img {
        opacity: 1;
    }
    
    &--error img {
        display: none;
    }
}

@keyframes skeleton-loading {
    0% {
        background-position: -200% 0;
    }
    100% {
        background-position: 200% 0;
    }
}
</style>
