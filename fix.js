function removeParticipantFromLocation(button) {
    if (confirm("삭제하시겠습니까?")) {
        const row = button.closest('tr');
        if (row) {
            row.remove();
        }
    }
}
