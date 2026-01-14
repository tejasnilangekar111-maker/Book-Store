export default function Square({ value, onSquareClick }) {
    // Determine style class based on value for specific coloring
    const statusClass = value === 'X' ? 'square x' : value === 'O' ? 'square o' : 'square';

    return (
        <button className={statusClass} onClick={onSquareClick}>
            {value}
        </button>
    );
}
