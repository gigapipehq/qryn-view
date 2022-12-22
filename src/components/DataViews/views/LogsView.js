import { TabsUnstyled } from "@mui/base";

import { LogRows } from "../components/Logs/LogRows";
import { VectorTable } from "../components/Table/VectorTable/VectorTable";
import { ViewHeader } from "../components/ViewHeader";
import { TabsList, Tab, TabPanel, ViewStyled } from "./styled";

export default function LogsView(props) {
    const {
        viewRef,
        panelSize,
        viewHeight,
        setStreamClose,
        setMaxHeight,
        setMinimize,
        actualQuery,
        total,
        type,
        theight,
        tableData,
        streamData,
    } = props;

    return (
        <ViewStyled ref={viewRef} size={panelSize} vheight={viewHeight}>
            <ViewHeader
                onClose={setStreamClose}
                setMinimize={setMinimize}
                setMaxHeight={setMaxHeight}
                actualQuery={actualQuery}
                total={total}
                type={type}
                {...props}
            />

            <TabsUnstyled defaultValue={0}>
                <TabsList panelsize={props.panelSize}>
                    <Tab>Logs</Tab>
                    <Tab>Table</Tab>
                </TabsList>
                <TabPanel value={0}>
                    <div className="view-content">
                        <LogRows
                            {...props}
                            onClose={setStreamClose}
                            messages={streamData}
                            actualQuery={actualQuery}
                        />
                    </div>
                </TabPanel>
                <TabPanel value={1}>
                    <div className="view-content">
                        <VectorTable
                            {...props}
                            height={theight}
                            data={tableData}
                            actualQuery={actualQuery}
                        />
                    </div>
                </TabPanel>
            </TabsUnstyled>
            {/* <div className="view-content">
                    {actualQuery?.tableView ? (
                        <VectorTable
                            {...props}
                            height={theight}
                            data={tableData}
                            actualQuery={actualQuery}
                        />
                    ) : (
                        <LogRows
                            {...props}
                            onClose={setStreamClose}
                            messages={streamData}
                            actualQuery={actualQuery}
                        />
                    )}
                </div> */}
        </ViewStyled>
    );
}