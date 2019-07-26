#!/bin/sh

tag=$DRONE_TAG
version=d

d_pattern='^v([0-9]+\.){2}[0-9]+-beta.*$'
p_pattern='^v([0-9]+\.){2}[0-9]+-p.*$'
y_pattern='^v([0-9]+\.){2}[0-9]+-y.*$'
r_pattern='^v([0-9]+\.){2}[0-9]+$'

if [ "$(echo $tag | grep -E $d_pattern)" != "" ]; then
    version=d
elif [ "$(echo $tag | grep -E $p_pattern)" != "" ]; then
    version=p
elif [ "$(echo $tag | grep -E $y_pattern)" != "" ]; then
    version=y
elif [ "$(echo $tag | grep -E $r_pattern)" != "" ]; then
    version=r
    exit 0
else
    echo '不是一个有效的tag'
    exit 1
fi

cp src/environments/environment.$version.ts src/environments/environment.r.ts
