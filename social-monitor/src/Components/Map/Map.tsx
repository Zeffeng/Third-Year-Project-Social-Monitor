import React from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";
import { GlobalProps } from '../../Types/GlobalProps';

am4core.useTheme(am4themes_animated);

interface MapProps extends GlobalProps {}
class Map extends React.Component<MapProps, {}> {
    chart: am4maps.MapChart | undefined;
    
    componentDidMount() {
        const data = this.props.globalState.get("CountryData")
        let mapChart = am4core.create("chartdiv", am4maps.MapChart);
        mapChart.geodata = am4geodata_worldLow
        mapChart.projection = new am4maps.projections.Miller();
        mapChart.height = am4core.percent(100)

        let polygonSeries = mapChart.series.push(new am4maps.MapPolygonSeries());
        polygonSeries.exclude = [
            "AQ", "HM", "TF", "RE", "SC", "IO", "CX", "CC", "MV", "BV", "GS", "SH", "ST",
            "JU", "KM", "YT", "GO", "GU", "PW", "MP", "FM", "NR", "MH", "TV", "NF", "CV", "FO",
            "PM", "TC", "KY", "PF", "PN", "CK", "NU", "TO", "WF", "TK"
        ];
        polygonSeries.useGeodata = true;
        polygonSeries.data = data;
        polygonSeries.mapPolygons.template.adapter.add("fill", (fill, target) => {
            if (target.dataItem)
                if(target.dataItem.value > 0.05) {
                    return am4core.color(this.getColorForPercentage(target.dataItem.value, true))
                } else if (target.dataItem.value < -0.05) {
                    return am4core.color(this.getColorForPercentage(target.dataItem.value, false))
                } else if (target.dataItem.value <= 0.05 && target.dataItem.value >= -0.05) {
                    return am4core.color("#FFFF22")
                }
            return fill
        })

        let polygonTemplate = polygonSeries.mapPolygons.template;
        polygonTemplate.tooltipText = "{name} : {value}";
        // polygonTemplate.propertyFields.fill = "fill"
        polygonTemplate.nonScalingStroke = true;

        // let hs = polygonTemplate.states.create("hover");
        // hs.properties.fill = am4core.color("#367B25");

        this.chart = mapChart;
    }

    componentWillUnmount() {
        if (this.chart) {
            this.chart.dispose();
        }
    }

    render() {
        return (
            <div id="chartdiv" style={{ width: "95%", height: "80%" }}></div>
        );
    }

    componentToHex(c: number) {
        const hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    getColorForPercentage(pct: number, mode: boolean) {
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
        
        return "#" + this.componentToHex(color.r) + this.componentToHex(color.g) + this.componentToHex(color.b);
    };
}


export default Map