import Reac from "react";
import toolState from "../../store/toolState";

const SettingBar = () => {
    return(
        <div className="setting-bar">
            <label htmlFor="line-width">Line width</label>
            <input 
                id="line-width" 
                onChange={e => toolState.setLineWidth(e.target.value)}
                type="number" 
                defaultValue={1} 
                min={1} 
                max={50} 
                style={{margin: '0 10px'}} />
            <label htmlFor="stroke-color">Stroke color</label>
            <input 
                id="stroke-color"
                onChange={e => toolState.setStrokeColor(e.target.value)}  
                type="color"/>
        </div>
    )
}

export default SettingBar;