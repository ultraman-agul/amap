<!--
 * new page
 * @author: zhaoyahui
 * @since: 2023-03-28
 * Map.vue
-->
<template>
    <div id="map"></div>
</template>

<script setup lang="ts">
import AMapLoader from '@amap/amap-jsapi-loader'


const props = defineProps({
    mapStyle: { 
        type: String, 
        default: 'amap://styles/darkblue', // 默认暗黑系
    },
    apiConfig: {
        type: Object,
        default: () => ({ // 对象或数组默认值必须从一个工厂函数获取
            // version: '2.0',
            version: '1.4.15',
            key: '67bc06bfdc3355fb7a17b5fea35de9cf',
            plugins: ["AMap.DistrictSearch", "AMap.ControlBar"],
        })
    },
    // 地图是否支持双击鼠标放大
    doubleClickZoom: { type: Boolean, default: true },
    // 中心点坐标
    center: { type: Array, default: () => [112.887853, 24.262789] },
    // 初始地图缩放等级
    zoom: { type: Number, default: 10 },
    // 地图显示的缩放级别范围
    zooms: { type: Array, default: () => [3, 18] },
     // 区域名
    areaName: { type: String, default: "清远市" },
    // 显示下级行政区级数,行政区级别包括：国家、省/直辖市、市、区/县4个级别
    subdistrict: { type: Number, default: 0 },
    // 是否返回行政区边界坐标点 all / base
    extensions: { type: String, default: "all" },
    // 搜索范围[对应文档https://lbs.amap.com/api/javascript-api/reference/search#m_AMap.DistrictSearch]
    level: { type: String, default: "city" },
    // 是否展示卫星地图
    isShowSatellite: { type: Boolean, default: true },
    // 是否展示卫星路网
    isShowRoadNet: { type: Boolean, default: true },
    polylineConfig: {
        type: Object,
        default: () => ({
            // 是否显示边界线
            show: true,
            // 是否显示边界以外的区域
            showOuter: false,
            // 边界线条颜色
            strokeColor: "#99ffff",
            // 边界线条粗细
            strokeWeight: 4,
        }),
    },
     // 是否3D显示
    isShow3D: { type: Boolean, default: true },
    // 俯视角度
    pitch: { type: Number, default: 40 },
    // 地图方位控制器配置
    controllBarConfig: {
        type: Object,
        default: () => ({
            // 是否显示方位控制器
            show: true,
            // 是否显示缩放按钮
            showZoomBar: true,
            // 是否显示倾斜、旋转按钮
            showControlButton: true,
            // 距离顶部的距离
            positionTop: 10,
            // 距离右侧的距离
            positionRight: 10,
        }),
    },
    // 3d墙体配置
    object3dWallConfig: {
        type: Object,
        default: () => ({
            // 是否显示3d墙体
            show: true,
            // 层级
            zIndex: 1,
            // 墙高
            wallHeight: -4000,
            // 墙体颜色
            color: "#0088ffcc",
            // 是否使用了透明颜色，并进行颜色混合
            transparent: true,
            // 控制显示正反面,both,front,back
            backOrFront: "both",
        }),
    },
})
const mapInstance = ref(null) // 地图实例
let myAMap: any //

// 渲染地图边界线
const renderPolyLine = (bounds = []) => {
    const { polylineConfig } = props
    if(!polylineConfig.show){
        return ;
    }
     for (let i = 0; i < bounds.length; i++) {
        new myAMap.Polyline({
            path: bounds[i],
            strokeColor: polylineConfig.strokeColor,
            strokeWeight: polylineConfig.strokeWeight,
            map: mapInstance.value,
        });
    }
} 
// 定义一个渲染3d墙体的方法
const render3dWall = (bounds = []) => {
    const { object3dWallConfig, apiConfig } = props;
    // 1.4.15版本的api通过Object3DLayer创建墙体
    if (apiConfig.version == "1.4.15") {
        if (object3dWallConfig.show) {
            // 定义一个3D图层
            const object3Dlayer = new myAMap.Object3DLayer({
                zIndex: object3dWallConfig.zIndex,
            });
            // 创建墙体
            const wall = new myAMap.Object3D.Wall({
                path: bounds,
                height: object3dWallConfig.wallHeight,
                color: object3dWallConfig.color,
            });
            wall.transparent = object3dWallConfig.transparent;
            wall.backOrFront = object3dWallConfig.backOrFront;
            object3Dlayer.add(wall);
            mapInstance.value.add(object3Dlayer);
        }
    } else if (apiConfig.version == "2.0") {
        // 2.0版本的api通过描边添加墙体
        for (let i = 0; i < bounds.length; i += 1) {
            new myAMap.Polyline({
                path: bounds[i],
                strokeColor: object3dWallConfig.color,
                strokeWeight: object3dWallConfig.wallHeight,
                map: mapInstance.value,
            });
        }
    }
};

// 定义一个渲染地图方位控制器
const renderControlBar = () => {
    const { controllBarConfig } = props;
    if (controllBarConfig.show) {
        mapInstance.value.addControl(
            new myAMap.ControlBar({
                showZoomBar: controllBarConfig.showZoomBar,
                showControlButton: controllBarConfig.showControlButton,
                position: {
                    right: `${controllBarConfig.positionRight}px`,
                    top: `${controllBarConfig.positionTop}px`,
                },
            }),
        );
    }
};

// 初始化地图
const initMapInstance = (AMap: any) => {
    myAMap = AMap;

    const option: {[key: string]: any} = {
        mapStyle: props.mapStyle,
        center: props.center,
        zoom: props.zoom,
        zooms: props.zooms,
        doubleClickZoom: props.doubleClickZoom,
         // 图层，卫星地图，卫星路网都属于图层，push到这个layers就可以了
        layers: [],
        pitch: props.pitch,
    }
    if(props.isShow3D){
        option.viewMode = '3D'
    }
    if(props.isShowSatellite){ // 展示卫星图层
        option.layers.push(new AMap.TileLayer.Satellite())
    }
    if(props.isShowRoadNet){ // 展示路网图层
        option.layers.push(new AMap.TileLayer.RoadNet())
    }

    const district = new AMap.DistrictSearch({ // 搜索城市信息
        level: props.level,
        extensions: props.extensions,
        subdistrict: props.subdistrict
    })
    console.log(district.search)
    district.search(props.areaName, function (status: string, res: any) {
        const bounds = res.districtList[0]['boundaries'] // 区域边界坐标
        option.mask = bounds.map((i: any) => [i]); // 区域以外添加遮罩
        console.log(option);
        
        mapInstance.value = new AMap.Map('map', option);
        mapInstance.value.on('click', (e) => {
            console.log(e);
        })
        // 渲染边界
        renderPolyLine(bounds);
        renderControlBar() // 渲染控制器
        render3dWall(bounds) // 渲染墙体
    })

}
const loadAMap = () => {
    AMapLoader.load({
        key: props.apiConfig.key,
        version: props.apiConfig.version,
        plugins: props.apiConfig.plugins,// 使用到的插件
    }).then((AMap) => {
        initMapInstance(AMap)
    });
};

onMounted(() => {
    loadAMap() // 加载地图
})
</script>

<style scoped>
#map{
    height: 100vh;
    width: 100vw;
}
</style>
