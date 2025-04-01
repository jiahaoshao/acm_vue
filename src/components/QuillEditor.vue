<template>
	<div style="display: block; width: 60%; height: 100%; margin: auto;">
		<QuillEditor
			ref="quillRef"
			v-model:content="content"
			:options="myOptions"
			contentType="html"
			@update:content="setValue()"
		/>
	</div>
</template>
<script setup>
import Compressor from 'compressorjs';
import { QuillEditor, Quill } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import ImageUploader from 'quill-image-uploader';
import ImageResize from 'quill-image-resize-custom-module';
// import { uploadFilesSysFile } from '@/api/api';

import '@/styles/QuillFont.css'; // 字体和字体大小的自定义文件
import { ref, reactive, watch, toRaw, getCurrentInstance } from 'vue';
import config from "@/../public/static/config.json";
import { ElMessage } from 'element-plus';

const globalProperties =
  getCurrentInstance().appContext.config.globalProperties; // 获取全局挂载
const api = globalProperties.$api;

const image_url = config.image_url;
// 设置行高的配置======start
const lineHeight = ['1', '1.25', '1.5', '1.75', '2.5', '3', '5'];
const parchment = Quill.import('parchment');
const lineHeightConfig = {
	scope: parchment.Scope.INLINE,
	whitelist: lineHeight,
};
const lineHeightStyle = new parchment.Attributor.Style(
	'lineHeight',
	'line-height',
	lineHeightConfig,
);
Quill.register({ 'formats/lineHeight': lineHeightStyle }, true);
// 设置行高的配置======end
 
const props = defineProps({
	// 左侧菜单数据
	modelValue: String,
});
const emit = defineEmits(['update:modelValue']);
const content = ref('');
const quillRef = ref(null);
// 设置字体大小
const fontSizeStyle = Quill.import('attributors/style/size'); // 引入这个后会把样式写在style上
fontSizeStyle.whitelist = [
	'12px',
	'14px',
	'16px',
	'18px',
	'20px',
	'22px',
	'24px',
	'28px',
	'30px',
];
// 设置字体
const fontStyle = Quill.import('attributors/style/font'); // 引入这个后会把样式写在style上
fontStyle.whitelist = [
	'SimSun', // 宋体
	'SimHei', // 黑体
	'STFANGSO', // 华文仿宋
	'Microsoft-YaHei', // 微软雅黑
	'KaiTi', // 楷体
	'FangSong', // 仿宋
	'STKAITI', // 华文楷体
	'Arial',
	'Times-New-Roman',
	'sans-serif',
];
 
Quill.register(fontSizeStyle, true);
Quill.register(fontStyle, true);
Quill.register('modules/imageUploader', ImageUploader);
Quill.register('modules/imageResize', ImageResize);
 
// 图片压缩
const compressImage = (file) => {
	return new Promise((resolve, reject) => {
		// eslint-disable-next-line no-new
		new Compressor(file, {
			quality: 0.6, // 设置压缩质量
			success(result) {
				resolve(result);
			},
			error(error) {
				reject(error);
			},
		});
	});
};
// 富文本配置项，将模块功能一起写入到配置项内，也可以单独配置Modules
const myOptions = reactive({
	modules: {
		toolbar: {
			container: [
				['bold', 'italic', 'underline', 'strike'], // 加粗、斜体、下划线、删除线
				[{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题，不同级别的标题
				[{ align: [] }], // 对齐方式
				['blockquote', 'code-block'], // 引用，代码块
				[{ script: 'sub' }, { script: 'super' }], // 上标/下标
				[{ list: 'ordered' }, { list: 'bullet' }], // 有序、无序列表
				[{ indent: '-1' }, { indent: '+1' }], // 缩进
				['image', 'video'], // 超链接 图片 视频
				[{ direction: 'rtl' }], // 文本方向
				[{ color: [] }, { background: [] }], // 字体颜色和背景色
				[{ size: fontSizeStyle.whitelist }], // 字体大小
				[{ font: fontStyle.whitelist }], // 字体
				// [{ lineheight: lineHeight }], // 设置行高
				['clean'], // 清除格式
			],
			handlers: {
				lineheight: (value) => {
					const editor = quillRef.value.getQuill();
					if (value) {
						editor.format('lineHeight', value);
					}
				},
			},
		},
		// 上传图片--进行压缩并修改为服务器地址
		imageUploader: {
			upload: async (file) => {
				try {
					const compressedFile = await compressImage(file); // 压缩图片
 
					// 将Blob格式转化为File格式
					const fileVal = new File([compressedFile], compressedFile.name, {
						type: compressedFile.type,
						lastModified: Date.now(),
					});
 
					return new Promise((resolve, reject) => {
						const formData = new FormData();
						formData.append('files', fileVal);
 
						api.articleApi.uploadArticleImages(formData)
                            .then((res) => {
                                console.log("成功返回:", res);
                            
                                if(res.data.code === 0){
                                    ElMessage.success(res.data.message);
                                    resolve(image_url + res.data.data);
                                }
                                else{
                                    ElMessage.error(res.data.message);
                                    reject('Upload failed');
                                }
                                
                            })
                            .catch((err) => {
                                console.error("请求失败:", err);
                                reject('Upload failed');
                            })
                            .finally(() => {
                                console.log("请求完成");
                            });
					});
				} catch (error) {
					console.error('压缩和上传图像时出错:', error);
					return false;
				}
			},
		},
		// 设置图片的大小--可拖拽设置大小
		imageResize: {
			parchment: Quill.import('parchment'),
		},
	},
	placeholder: '请输入内容...',
});
 
const setValue = () => {
	// 用于设置双向绑定值
	const text = toRaw(quillRef.value).getHTML();
	emit('update:modelValue', text);
};
 
watch(
	() => props.modelValue,
	(val) => {
		if (val) {
			content.value = val; // 用于监听绑定值进行数据回填
		} else {
			// eslint-disable-next-line no-unused-expressions
			toRaw(quillRef.value) && toRaw(quillRef.value).setContents(''); // 可用于弹窗使用富文本框关闭弹窗清除值
		}
	},
	{
		immediate: true, // 组件创建时立即执行一次回调
	},
);
</script>
<style>
.ql-container {
	height: calc(100% - 142px);
}
</style>