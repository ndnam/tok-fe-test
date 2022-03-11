import React, { useEffect } from "react";
import datafeed from '../chart_services/datafeed';
import ResolutionSelector from './ResolutionSelector';

function TVChartContainer({...props}) {
    let tvWidget;
    useEffect(() => {
        tvWidget = new window.TradingView.widget({
            symbol: 'BTCUSDT', 
            interval: '1D', 
            // fullscreen: true, 
            theme: 'Dark',
            container: 'tv_chart_container',
            datafeed,
            library_path: '/charting_library/charting_library/',
        });

        return () => {
            tvWidget && tvWidget.remove();
        };
    }, []);

    const setChartResolution = resolution => {
        tvWidget.activeChart().setResolution(resolution);
    };

    return (
        <React.Fragment>
            <ResolutionSelector onChange={setChartResolution} />
            <div id="tv_chart_container"></div>
        </React.Fragment>
    );
}

export default TVChartContainer;
