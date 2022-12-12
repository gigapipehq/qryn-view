import { SettingsTitle } from "../styles";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import CachedOutlinedIcon from "@mui/icons-material/CachedOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { cx, css } from "@emotion/css";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import setIsDatasourceSaved from "../store/setIsDataSourceSaved";
import { themes } from "../../../theme/themes";

const confirmSaveLoaderIcon = css`
    height: 12px !important;
    width: 12px !important;
    color: white;
    margin: 0px 4px;
`;
const confirmSaveLoaderCont = (theme) => css`
    display: flex;
    align-items: center;
    background: ${theme.primaryDark};
    color: white;
    font-size: 11px;
    padding: 4px;
    border-radius: 3px;
    margin-right: 10px;
    cursor: pointer;
    span {
        margin-right: 4px;
        font-weight: bold;
    }
`;
const SavingLoader = css`
    display: flex;
    align-items: center;
    font-size: 12px;
    &.loading-icon {
        height: 14px;
        width: 14px;
    }
`;

const ConfirmSave = ({setIsSaved}) => {
    const storeTheme = useSelector((store) => store.theme);

    const theme = useMemo(() => {
        return themes[storeTheme];
    }, [storeTheme]);

    return (
        <div
            className={cx(confirmSaveLoaderCont(theme))}
            onClick={(e) => setIsSaved(false)}
        >
            <CheckCircleIcon className={cx(confirmSaveLoaderIcon)} />{" "}
            <span>Saved</span>
        </div>
    );
};

export function SectionHeader(props) {
    const { onClickAdd, isAdd, title, isEditing } = props;
    const dispatch = useDispatch();
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        if (isEditing) {
            setTimeout(() => {
                setIsSaved(true);
                dispatch(setIsDatasourceSaved(true));
            }, 800);

            setIsSaved(false);
        }

        setIsSaved(false);

        return () => {
            setIsSaved(false);
        };
    }, [isEditing]);

    return (
        <SettingsTitle>
            {title}
            <div className="edit-buttons">
                {isEditing && (
                    <div className={SavingLoader}>
                        <CachedOutlinedIcon
                            style={{ height: "13px", width: "13px" }}
                        />{" "}
                        Saving ...
                    </div>
                )}
                {isSaved && <ConfirmSave setIsSaved={setIsSaved}/>}

                {isAdd && (
                    <>
                        <AddOutlinedIcon
                            fontSize={"small"}
                            style={{
                                cursor: "pointer",
                                display: "flex",
                            }}
                            onClick={onClickAdd}
                        />
                    </>
                )}
            </div>
        </SettingsTitle>
    );
}
