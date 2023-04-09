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
            version: '2.0',
            // version: '1.4.15',
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
    isShowSatellite: { type: Boolean, default: false },
    // 是否展示卫星路网
    isShowRoadNet: { type: Boolean, default: false },
    polylineConfig: { // 边界线样式
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
    // 是否绘制线条
    isDrawPolyLine: { type: Boolean, default: true },
    // 线条数据
    polyLineData: {
        type: Array,
        default: () => [
            {
                path: [
                    [112.72571, 24.449534],
                    [113.245419, 24.168629],
                    [113.194628, 23.791832]
                ],
                // 是否显示描边
                isOutline: true,
                // 线条描边颜色
                outlineColor: "#ffeeff",
                // 描边的宽度
                borderWeight: 3,
                // 线条颜色
                strokeColor: "#3366FF",
                // 线条透明度，取值范围[0,1]，默认0.9
                strokeOpacity: 1,
                // 线条宽度
                strokeWeight: 6,
                // 线条样式，实线:solid，虚线:dashed
                strokeStyle: "solid",
                // 勾勒形状轮廓的虚线和间隙的样式
                strokeDasharray: [10, 5],
                // 折线拐点的绘制样式，默认值为'miter'尖角，其他可选值：'round'圆角、'bevel'斜角
                lineJoin: "round",
                // 折线两端线帽的绘制样式，默认值为'butt'无头，其他可选值：'round'圆头、'square'方头
                lineCap: "round",
                // 折线覆盖物的叠加顺序
                zIndex: 50,
            },
            {
                path: [
                    [112.623349, 24.045431],
                    [112.793974, 23.74417]
                ],
                // 是否显示描边
                isOutline: true,
                // 线条描边颜色
                outlineColor: "#ffeeff",
                // 描边的宽度
                borderWeight: 3,
                // 线条颜色
                strokeColor: "#3366FF",
                // 线条透明度，取值范围[0,1]，默认0.9
                strokeOpacity: 1,
                // 线条宽度
                strokeWeight: 6,
                // 线条样式，实线:solid，虚线:dashed
                strokeStyle: "solid",
                // 勾勒形状轮廓的虚线和间隙的样式
                strokeDasharray: [10, 5],
                // 折线拐点的绘制样式，默认值为'miter'尖角，其他可选值：'round'圆角、'bevel'斜角
                lineJoin: "round",
                // 折线两端线帽的绘制样式，默认值为'butt'无头，其他可选值：'round'圆头、'square'方头
                lineCap: "round",
                // 折线覆盖物的叠加顺序
                zIndex: 50,
            },
        ],
    },
    // 是否绘制点位
    isDrawPoint: { type: Boolean, default: true },
    // 点位数据
    pointData: {
        type: Array,
        default: () => [
            {
                // 唯一值
                iden: "点位1",
                // 坐标
                lngLat: [112.952847, 23.98007],
                // marker点位基于坐标的偏移量
                // offset: [-13, -30],
                // 自定义图标(Object可设置精灵图定位，String为图标地址)
                icon: {
                    // 图标大小
                    size: [25, 34],
                    // 图标地址
                    image: "//a.amap.com/lbs-dev-yuntu/static/web/image/common/newtag.png",
                    // 图标所用的图片大小
                    imageSize: [135, 40],
                    // 图标取图偏移量(背景图定位)
                    // imageOffset: [-9, -3],
                },
            },
            {
                // 唯一值
                iden: "点位2",
                // 坐标
                lngLat: [113.005128, 23.644603],
                // marker点位基于坐标的偏移量
                // offset: [-13, -30],
                // 自定义图标(Object可设置精灵图定位，String为图标地址)
                // icon: "//a.amap.com/jsapi_demos/static/demo-center/icons/dir-via-marker.png",
                icon: {
                    // 图标大小
                    size: [25, 34],
                    // 图标地址
                    image: "//a.amap.com/jsapi_demos/static/demo-center/icons/dir-via-marker.png",
                    // 图标所用的图片大小
                    imageSize: [135, 40],
                    // 图标取图偏移量(背景图定位)
                    // imageOffset: [-9, -3],
                },
            },
            {
                // 唯一值
                iden: "点位3",
                // 坐标
                lngLat: [113.425473, 24.106349],
                // marker点位基于坐标的偏移量
                // offset: [-13, -30],
                // 自定义图标(Object可设置精灵图定位，String为图标地址)
                icon: {
                    // 图标大小
                    size: [25, 34],
                    // 图标地址
                    image: "//a.amap.com/lbs-dev-yuntu/static/web/image/common/newtag.png",
                    // 图标所用的图片大小
                    imageSize: [135, 40],
                    // 图标取图偏移量(背景图定位)
                    // imageOffset: [-95, -3],
                },
            },
        ],
    },
})
const mapInstance = ref<any>(null) // 地图实例
let myAMap: any //

// 渲染地图边界线
const renderPolyLine = (bounds = []) => {
    const { polylineConfig } = props
    if (!polylineConfig.show) {
        return
    }
    for (let i = 0; i < bounds.length; i++) {
        new myAMap.Polyline({
            path: bounds[i],
            strokeColor: polylineConfig.strokeColor,
            strokeWeight: polylineConfig.strokeWeight,
            map: mapInstance.value,
        })
    }
}
// 定义一个渲染3d墙体的方法
const render3dWall = (bounds = []) => {
    const { object3dWallConfig, apiConfig } = props
    // 1.4.15版本的api通过Object3DLayer创建墙体
    if (apiConfig.version == "1.4.15") {
        if (object3dWallConfig.show) {
            // 定义一个3D图层
            const object3Dlayer = new myAMap.Object3DLayer({
                zIndex: object3dWallConfig.zIndex,
            })
            // 创建墙体
            const wall = new myAMap.Object3D.Wall({
                path: bounds,
                height: object3dWallConfig.wallHeight,
                color: object3dWallConfig.color,
            })
            wall.transparent = object3dWallConfig.transparent
            wall.backOrFront = object3dWallConfig.backOrFront
            object3Dlayer.add(wall)
            mapInstance.value.add(object3Dlayer)
        }
    } else if (apiConfig.version == "2.0") {
        // 2.0版本的api通过描边添加墙体
        for (let i = 0; i < bounds.length; i += 1) {
            new myAMap.Polyline({
                path: bounds[i],
                strokeColor: object3dWallConfig.color,
                strokeWeight: object3dWallConfig.wallHeight,
                map: mapInstance.value,
            })
        }
    }
}

// 定义一个渲染地图方位控制器
const renderControlBar = () => {
    const { controllBarConfig } = props
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
        )
    }
}

// 渲染线条
const renderLine = () => {
    const { isDrawPolyLine, polyLineData }: any = props
    if (isDrawPolyLine) {
        const polyLines = []
        for (let i = 0; i < polyLineData.length; i++) {
            const polyline = new myAMap.Polyline({
                // 线条坐标
                path: polyLineData[i].path,
                // 是否显示外线
                isOutline: polyLineData[i].isOutline,
                // 外线颜色
                outlineColor: polyLineData[i].outlineColor,
                // 外线宽度
                borderWeight: polyLineData[i].borderWeight,
                // 线条颜色
                strokeColor: polyLineData[i].strokeColor,
                // 线条透明度
                strokeOpacity: polyLineData[i].strokeOpacity,
                // 线条宽度
                strokeWeight: polyLineData[i].strokeWeight,
                // 线条样式，实线:solid，虚线:dashed
                strokeStyle: polyLineData[i].strokeStyle,
                // 勾勒形状轮廓的虚线和间隙的样式
                strokeDasharray: polyLineData[i].strokeDasharray,
                // 折线拐点的绘制样式
                lineJoin: polyLineData[i].lineJoin,
                // 折线两端线帽的绘制样式
                lineCap: polyLineData[i].lineCap,
                //  折线覆盖物的叠加顺序
                zIndex: polyLineData[i].zIndex,
            })
            polyLines.push(polyline)
        }
        mapInstance.value.add(polyLines)
    }
}


// 渲染点位
const renderPoint = () => {
    const { isDrawPoint, pointData }: any = props

    if (isDrawPoint) {
        // 渲染批量点位使用MassMarks对象，相当于添加新的图层 - START
        // styles存储所有的图标样式
        const styles: any[] = []
        // 为了兼容原来的方式，构造一个新对象存储在styles
        // anchor为图标在地图上的偏移量，url等同于Marker对象的Icon的image
        pointData.forEach((point: any) => {
            const findItem = styles.find(icon => icon.image == point.icon.image)
            if (!findItem) {
                styles.push({ ...point.icon, anchor: new myAMap.Pixel(15, 35), url: point.icon.image })
            }
        })
        // 构造新的点位集合，因为MassMarks对象的点位中必须有lnglat经纬度
        // 与Marker对象的经纬度区别在于Lat的L要小写
        // style为当前点位的图标样式在styles中的索引
        const points = pointData.map((point: any) => ({ ...point, lnglat: point.lngLat, style: styles.findIndex(icon => icon.url === point.icon.image) }))
        // 生成一个海量点图层，第一个参数为点位数据，第二个参数为一个options，选项样式
        const massMarks = new myAMap.MassMarks(points, {
            zIndex: 114,
            zooms: [3, 19],
            style: styles
        })
        // 将当前海量点图层添加到地图上
        massMarks.setMap(mapInstance.value)
        // 点位添加点击事件
        massMarks.on("click", function ({ data }) {
            console.log(data)
        })
        console.log(massMarks)
        massMarks.show = false
        // 渲染批量点位使用MassMarks对象，相当于添加新的图层 - END
    }
}

// 初始化地图
const initMapInstance = (AMap: any) => {
    myAMap = AMap

    const option: { [key: string]: any } = {
        mapStyle: props.mapStyle,
        center: props.center,
        zoom: props.zoom,
        zooms: props.zooms,
        doubleClickZoom: props.doubleClickZoom,
        // 图层，卫星地图，卫星路网都属于图层，push到这个layers就可以了
        layers: [],
        pitch: props.pitch,
    }
    if (props.isShow3D) {
        option.viewMode = '3D'
    }
    if (props.isShowSatellite) { // 展示卫星图层
        option.layers.push(new AMap.TileLayer.Satellite())
    }
    if (props.isShowRoadNet) { // 展示路网图层
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
        option.mask = bounds.map((i: any) => [i]) // 区域以外添加遮罩
        console.log(option)

        mapInstance.value = new AMap.Map('map', option)
        mapInstance.value.on('click', (e: any) => {
            console.log([e.lnglat.lng, e.lnglat.lat])
        })
        // 渲染边界
        renderPolyLine(bounds)
        renderControlBar() // 渲染控制器
        render3dWall(bounds) // 渲染墙体
        renderLine() // 渲染线条
        renderPoint() // 渲染点位
    })

}
const loadAMap = () => {
    AMapLoader.load({
        key: props.apiConfig.key,
        version: props.apiConfig.version,
        plugins: props.apiConfig.plugins,// 使用到的插件
    }).then((AMap) => {
        initMapInstance(AMap)
    })
}

onMounted(() => {
    loadAMap() // 加载地图
})
</script>

<style scoped>
#map {
    height: 100vh;
    width: 100vw;
}
</style>
