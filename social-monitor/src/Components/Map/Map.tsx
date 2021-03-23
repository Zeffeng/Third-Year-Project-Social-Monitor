import React from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";
import { GlobalProps } from '../../Types/GlobalProps';
import { Country, CountryCodeData } from '../../Types/MapState';

am4core.useTheme(am4themes_animated);

interface MapProps extends GlobalProps {
    timelineValue: number
}
const Map: React.FC<MapProps> = (props: MapProps) => {
    const { globalState } = props;
    const [chart, setChart] = React.useState<am4maps.MapChart | undefined>(undefined)
    const [curTimelineVal, setCurTimelineVal] = React.useState(-1)

    React.useEffect(() => {
        if (chart === undefined) {
            const data = globalState.get("CountryData") as Country[]
            let mapChart = am4core.create("chartdiv", am4maps.MapChart);
            mapChart.geodata = am4geodata_worldLow
            mapChart.projection = new am4maps.projections.Miller();
            mapChart.height = am4core.percent(100)

            let polygonSeries = mapChart.series.push(new am4maps.MapPolygonSeries());
            polygonSeries.exclude = [
                "AQ", "HM", "TF", "RE", "SC", "IO", "CX", "CC", "BV", "GS", "SH", "ST",
                "JU", "KM", "YT", "GO", "GU", "PW", "MP", "FM", "NR", "MH", "NF", "CV", "FO",
                "PM", "TC", "KY", "PF", "PN", "CK", "NU", "TO", "WF", "TK"
            ];
            polygonSeries.useGeodata = true;
            polygonSeries.data = data;
            polygonSeries.mapPolygons.template.adapter.add("fill", (fill, target) => {
                const item = (target.dataItem.dataContext as Country)
                if (item) {
                    if (item.value) {
                        if(item.value > 0.05) {
                            return am4core.color(getColorForPercentage(item.value, true))
                        } else if (item.value < -0.05) {
                            return am4core.color(getColorForPercentage(item.value, false))
                        } else if (item.value <= 0.05 && item.value >= -0.05) {
                            return am4core.color("#FFFF22")
                        }
                    } else {
                        return am4core.color("#D9D9D9")
                    }
                }
                return fill
            })

            let polygonTemplate = polygonSeries.mapPolygons.template;
            polygonTemplate.tooltipText = "{name} : {value}";
            polygonTemplate.nonScalingStroke = true;

            setChart(mapChart)
        }
    }, [chart, globalState, getColorForPercentage])

    React.useEffect(() => {
        if (curTimelineVal !== -1 && chart){
            const polygons = chart.series.getIndex(0) as am4maps.MapPolygonSeries;
            if (polygons) {
                const timelineData = globalState.get("TimelineData")[props.timelineValue] as CountryCodeData
                if (timelineData) {
                    for (const [key, value] of Object.entries(timelineData)) {
                        const polygon = polygons.getPolygonById(key)
                        if (polygon) {
                            const val = value as number
                            (polygon.dataItem.dataContext as Country).value = val
                            polygon.dataItem.value = val
                            let fill = polygon.fill
                            if (val) {
                                if(val > 0.05) {
                                    fill = am4core.color(getColorForPercentage(val, true))
                                } else if (val < -0.05) {
                                    fill = am4core.color(getColorForPercentage(val, false))
                                } else if (val <= 0.05 && val >= -0.05) {
                                    fill = am4core.color("#FFFF22")
                                }
                            } else {
                                fill = am4core.color("#D9D9D9")
                            }
                            polygon.fill = fill
                        }
                    }
                }
                polygons.invalidateRawData()
            }
        }
        setCurTimelineVal(props.timelineValue)
    }, [props.timelineValue])

    return (
        <div id="chartdiv" style={{ width: "99%", height: "80%" }}></div>
    );    

    function componentToHex(c: number) {
        const hex = c.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    }

    function getColorForPercentage(pct: number, mode: boolean) {
        const positive = [
            { pct: 0.05, color: { r: 0xff, g: 0xff, b: 0x22 } },
            { pct: 0.5, color: { r: 0x86, g: 0xff, b: 0x11 } },
            { pct: 1.0, color: { r: 0x09, g: 0xff, b: 0x00 } } 
        ];

        const negative = [
            { pct: -1.0, color: { r: 0xff, g: 0x00, b: 0x0e } },
            { pct: -0.5, color: { r: 0xff, g: 0x7a, b: 0x18 } },
            { pct: -0.05, color: { r: 0xff, g: 0xff, b: 0x22 } } 
        ];
        
        var percentColors;
        if (mode)
            percentColors = positive
        else
            percentColors = negative
        for (var i = 1; i < percentColors.length - 1; i++) {
            if (pct < percentColors[i].pct) {
                break;
            }
        }
        const lower = percentColors[i - 1];
        const upper = percentColors[i];
        const range = upper.pct - lower.pct;
        const rangePct = (pct - lower.pct) / range;
        const pctLower = 1 - rangePct;
        const pctUpper = rangePct;
        const color = {
            r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
            g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
            b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
        };
        
        return "#" + componentToHex(color.r) + componentToHex(color.g) + componentToHex(color.b);
    };
}


export default Map;