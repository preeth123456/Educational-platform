-- Create triggers to prevent audit log modifications (run separately)

DROP TRIGGER IF EXISTS prevent_audit_update;
CREATE TRIGGER prevent_audit_update 
BEFORE UPDATE ON audit_logs_enhanced
FOR EACH ROW
BEGIN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Audit logs cannot be modified';
END;

DROP TRIGGER IF EXISTS prevent_audit_delete;
CREATE TRIGGER prevent_audit_delete 
BEFORE DELETE ON audit_logs_enhanced
FOR EACH ROW
BEGIN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Audit logs cannot be deleted';
END;