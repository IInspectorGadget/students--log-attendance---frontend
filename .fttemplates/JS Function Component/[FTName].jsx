import cx from 'classnames';



import s from './[FTName].module.scss';

const <FTName | capitalize> = ({className}) => {
    return <div className={cx(s.root, className)}></div>;
};

export default <FTName | capitalize>;