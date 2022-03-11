import _ from 'lodash';
import PropTypes from 'prop-types';
import { useState } from 'react';
import classNames from "classnames";
import styles from './ResolutionSelector.module.scss';

const intervals = {
	'1': '1m',
	'3': '3m',
	'5': '5m',
	'15': '15m',
	'30': '30m',
	'60': '1H',
	'120': '2H',
	'240': '4H',
	'360': '6H',
	'480': '8H',
	'720': '12H',
	'1D': '1D',
	'3D': '3D',
	'1W': '1W',
	'1M': '1M',
};
const intervalKeys = ['time', ...Object.keys(intervals)];

function ResolutionSelector({ onChange }) {
    const [quickMenuOptions, setQuickMenuOptions] = useState(['time', '15', '60', '240', '1D', '1W']);
    const [newQuickMenuOptions, setNewQuickMenuOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState('1D');
    const [isEditing, setIsEditing] = useState(false);

    const getLabel = intervalKey => intervals[intervalKey] || _.capitalize(intervalKey);
    const handleEdit = () => {
        setIsEditing(true);
        setNewQuickMenuOptions([...quickMenuOptions]);
    };
    const handleSave = () => {
        setIsEditing(false);
        setQuickMenuOptions(newQuickMenuOptions);
    };
    const toggleEdittingOption = intervalKey => () => {
        setNewQuickMenuOptions(
            newQuickMenuOptions.includes(intervalKey)
            ? _.difference(newQuickMenuOptions, [intervalKey])
            : [...newQuickMenuOptions, intervalKey]
        );
    };
    const handleSelectOption = intervalKey => () => {
        setSelectedOption(intervalKey);
        onChange(intervalKey);
    };

    return (
        <div className={styles.container}>
            <div className={styles.row}>
                <div className={styles.quickMenu}>
                    {intervalKeys.map(intervalKey => quickMenuOptions.includes(intervalKey) && (
                        <div className={classNames({
                                [styles.quickBtn]: true,
                                [styles.active]: intervalKey == selectedOption,
                            })} key={intervalKey} onClick={handleSelectOption(intervalKey)}
                        >
                            {getLabel(intervalKey)}
                        </div>
                    ))}
                </div>
                
                <div className={classNames({
                    [styles.dropDown]: true,
                    [styles.show]: isEditing,
                })}>
                    <div className={styles.dropDownBtn}>
                        {quickMenuOptions.includes(selectedOption) || (
                            <div className={styles.selectedOption}>{getLabel(selectedOption)}</div>
                        )}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="interval-expand-btn css-l27wmy"><path d="M16 9v1.2L12 15l-4-4.8V9h8z" fill="currentColor"></path></svg>
                    </div>
                    <div className={styles.dropDownDialog}>
                        <div className={styles.dialogContent}>
                            <div className={styles.dialogHeader}>
                                <div className={styles.headerText}>Select Intervals</div>
                                <button type="button" onClick={isEditing ? handleSave : handleEdit}>{isEditing ? 'Save' : 'Edit'}</button>
                            </div>
                            <div className={styles.intervalOptions}>
                                {
                                    isEditing
                                    ? intervalKeys.map(intervalKey => (
                                        <label key={intervalKey} className={classNames({[styles.active]: newQuickMenuOptions.includes(intervalKey)})}
                                            onClick={toggleEdittingOption(intervalKey)}
                                        >
                                            <div className={styles.text}>{getLabel(intervalKey)}</div>
                                            <div className={styles.checkBox}>
                                                <div className={styles.icon}>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="css-1qqpxcw"><path d="M20.5 7.42L9.41 18.5 8 17.09l-5-5 1.41-1.42 5 5L19.08 6l1.42 1.42z" fill="currentColor"></path></svg>    
                                                </div>
                                            </div>
                                        </label>
                                    ))
                                    : intervalKeys.map(intervalKey => (
                                        <label key={intervalKey} className={classNames({[styles.active]: quickMenuOptions.includes(intervalKey)})}
                                            onClick={handleSelectOption(intervalKey)}
                                        >
                                            <div className={styles.text}>{getLabel(intervalKey)}</div>
                                        </label>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

ResolutionSelector.propTypes = {
    onChange: PropTypes.func,
};

export default ResolutionSelector;
