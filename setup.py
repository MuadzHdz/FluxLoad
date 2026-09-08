import re
from setuptools import setup, find_packages

with open("fluxload/__init__.py", "r", encoding="utf-8") as f:
    match = re.search(r'^__version__\s*=\s*[\'"]([^\'"]*)[\'"]', f.read(), re.MULTILINE)
    version = match.group(1) if match else "2.0.0"

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

setup(
    name="fluxload",
    version=version,
    author="Mu'adz",
    author_email="adzhdz73@gmail.com",
    description="FluxLoad: An enterprise-grade collaborative file sharing platform with real-time features, user management, and advanced search.",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/MuadzHdz/fluxload",
    packages=find_packages(),
    include_package_data=True,
    classifiers=[
        "Development Status :: 5 - Production/Stable",
        "Intended Audience :: Developers",
        "Intended Audience :: End Users/Desktop",
        "Intended Audience :: System Administrators",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
        "Programming Language :: Python :: 3",
        "Topic :: Communications :: File Sharing",
        "Topic :: Internet :: WWW/HTTP :: HTTP Servers",
        "Topic :: Internet :: WWW/HTTP :: Dynamic Content",
        "Topic :: Software Development :: Libraries :: Python Modules",
    ],
    python_requires=">=3.8",
    install_requires=[
        "Flask>=2.3",
        "Werkzeug>=2.3",
        "qrcode[pil]>=7.0",
        "Flask-SocketIO>=5.3",
        "python-socketio>=5.8",
        "Flask-SQLAlchemy>=3.0",
        "Flask-Login>=0.6",
        "SQLAlchemy>=2.0",
        "Pillow>=9.5",
        "whoosh>=2.7",
        "python-dotenv>=1.0",
        "requests>=2.31",
        "python-magic>=0.4",
        "PyPDF2>=3.0",
        "python-docx>=0.8.11",
    ],
    extras_require={
        "redis": ["Flask-Session>=0.5", "redis>=4.5"],
        "elasticsearch": ["elasticsearch>=8.9"],
        "watchdog": ["watchdog>=3.0"],
    },
    entry_points={
        "console_scripts": [
            "fluxload=fluxload.advanced_main:main",
        ],
    },
)
