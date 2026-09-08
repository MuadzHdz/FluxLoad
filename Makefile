.PHONY: help install test run run-adv docker-build docker-run lint clean

help:
	@echo "FluxLoad Python - Developer Tasks"
	@echo "  make install      Install package in editable mode"
	@echo "  make test         Run pytest test suite with coverage"
	@echo "  make run          Run simple Flask file server"
	@echo "  make run-adv      Run enterprise advanced file server"
	@echo "  make docker-build Build Docker container image"
	@echo "  make docker-run   Run Docker container"

install:
	pip install -e .

test:
	pytest -v --cov=fluxload --cov-report=term-missing

run:
	python -m fluxload

run-adv:
	python -m fluxload.advanced_main

docker-build:
	docker build -t fluxload:python .

docker-run:
	docker run -p 5000:5000 -v $(PWD)/uploads:/data fluxload:python

clean:
	rm -rf build/ dist/ *.egg-info .pytest_cache .coverage htmlcov
