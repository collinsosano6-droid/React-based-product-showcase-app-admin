
function DeleteConfirmation({ productName, onConfirm, onCancel }) {
  return (
    <div className="delete-confirmation" role="alertdialog" aria-modal="true">
      <h2>Delete product?</h2>

      <p>
        Are you sure you want to delete "{productName}"?
        This action cannot be undone.
      </p>

      <button type="button" onClick={onCancel}>
        Cancel
      </button>

      <button type="button" onClick={onConfirm}>
        Confirm delete
      </button>
    </div>
  );
}

export default DeleteConfirmation;