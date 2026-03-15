.PHONY: all install build clean

all: build

install:
	npm install

build: install
	npm run build

clean:
	rm -rf dist node_modules
