import os
import tempfile
import pytest
from fluxload.utils import validate_path, get_previewable_extensions, read_file_content
from fluxload.models import db, User
from fluxload import server, advanced_server


class TestSecurityAndPathValidation:
    def test_validate_path_normal(self, tmp_path):
        base = str(tmp_path)
        subfile = str(tmp_path / "sub" / "file.txt")
        assert validate_path(subfile, base) is True

    def test_validate_path_traversal(self, tmp_path):
        base = str(tmp_path / "upload")
        os.makedirs(base, exist_ok=True)
        malicious = str(tmp_path / "upload" / ".." / "secret.txt")
        assert validate_path(malicious, base) is False

    def test_validate_path_sibling_prefix_attack(self, tmp_path):
        # Sibling directory starting with the same prefix string
        base = str(tmp_path / "uploads")
        sibling = str(tmp_path / "uploads_backup" / "file.txt")
        os.makedirs(base, exist_ok=True)
        os.makedirs(os.path.dirname(sibling), exist_ok=True)

        # In a vulnerable startswith check, sibling would return True
        # In our os.path.commonpath check, it must be False
        assert validate_path(sibling, base) is False

    def test_previewable_extensions(self):
        exts = get_previewable_extensions()
        assert ".txt" in exts
        assert ".png" in exts
        assert ".json" in exts

    def test_read_file_content_safe(self, tmp_path):
        f = tmp_path / "sample.txt"
        f.write_text("Hello secure FluxLoad!", encoding="utf-8")
        content = read_file_content(str(f))
        assert content == "Hello secure FluxLoad!"


class TestServerDeleteSafeguard:
    def test_delete_root_prevented(self, tmp_path):
        upload_dir = str(tmp_path / "uploads")
        os.makedirs(upload_dir, exist_ok=True)
        app = server.create_app(directory=upload_dir)
        app.config["TESTING"] = True
        client = app.test_client()

        # Attempt to delete root via path "."
        res = client.post("/delete/.", follow_redirects=True)
        assert res.status_code == 200
        assert os.path.exists(upload_dir)

    def test_simple_server_api_files(self, tmp_path):
        upload_dir = str(tmp_path / "uploads")
        os.makedirs(upload_dir, exist_ok=True)
        with open(os.path.join(upload_dir, "sample.txt"), "w") as f:
            f.write("hello world")
        os.makedirs(os.path.join(upload_dir, "subdir"), exist_ok=True)

        app = server.create_app(directory=upload_dir)
        app.config["TESTING"] = True
        client = app.test_client()
        res = client.get("/api/files")
        assert res.status_code == 200
        data = res.get_json()
        assert "items" in data
        names = [item["name"] for item in data["items"]]
        assert "sample.txt" in names
        assert "subdir" in names


class TestAdvancedServerAndApi:
    @pytest.fixture
    def adv_app(self, tmp_path):
        upload_dir = str(tmp_path / "uploads")
        os.makedirs(upload_dir, exist_ok=True)
        db_path = str(tmp_path / "test.db")
        db_url = f"sqlite:///{db_path}"

        app = advanced_server.create_app(directory=upload_dir, database_url=db_url)
        app.config["TESTING"] = True
        app.config["WTF_CSRF_ENABLED"] = False
        yield app

    def test_api_routes_registered_not_404(self, adv_app):
        # When unauthenticated, /api/files must return 401, NOT 404
        client = adv_app.test_client()
        res = client.get("/api/files")
        assert res.status_code == 401
        data = res.get_json()
        assert "error" in data

    def test_registered_user_login(self, adv_app):
        with adv_app.app_context():
            user = User(
                username="testuser",
                email="test@fluxload.local",
                full_name="Test User",
                role="user"
            )
            user.set_password("SecretPass123!")
            db.session.add(user)
            db.session.commit()

        # Login with wrong password first
        client_fail = adv_app.test_client()
        res_fail = client_fail.post("/login", data={
            "username": "testuser",
            "password": "WrongPassword"
        }, follow_redirects=True)
        assert res_fail.status_code == 200
        assert b"Invalid credentials" in res_fail.data

        # Login with correct credentials
        client_ok = adv_app.test_client()
        res = client_ok.post("/login", data={
            "username": "testuser",
            "password": "SecretPass123!"
        }, follow_redirects=False)
        assert res.status_code == 302
        assert "/login" not in res.location
