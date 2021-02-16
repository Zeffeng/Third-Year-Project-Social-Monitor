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
        polygonSeries.heatRules.push({
            "property": "fill",
            "target": polygonSeries.mapPolygons.template,
            "min": am4core.color("#e60000"),
            "max": am4core.color("#00e64d")
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
}


export default Map