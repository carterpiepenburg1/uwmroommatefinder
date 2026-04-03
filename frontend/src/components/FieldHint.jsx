import '../styles/FieldHint.css';

/**
 * FieldHint — A small ⓘ icon next to a label that reveals
 * an explanatory tooltip on hover.
 *
 * Props:
 *   text  {string}  — The help text shown inside the tooltip.
 *   position {string} — 'top' | 'bottom' | 'left' | 'right'  (default: 'top')
 */
const FieldHint = ({ text, position = 'top' }) => {
  return (
    <span className={`field-hint field-hint--${position}`} aria-label={text}>
      <span className="field-hint__icon" aria-hidden="true">ⓘ</span>
      <span className="field-hint__tooltip" role="tooltip">
        {text}
      </span>
    </span>
  );
};

export default FieldHint;
