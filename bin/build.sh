#!/bin/bash

rm -rf build
mkdir build
mkdir build/mobile
cp -r img build/
cp -r css build/
cp -r css/* build/mobile
cp -r js build/
cd build/
#compress css
for i in `find ./mobile -name '*.css'`
	do 
	java -jar $1 --type css --charset utf-8 -o $i $i
done
#compress js
#for i in `find ./js -name '*.js'`
	#do 
	#java -jar $1 --type js --charset utf-8 -o $i $i
#done
