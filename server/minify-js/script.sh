#!/bin/bash

base_folder="js"
dest_folder="js-minify"
base_folder_path="$PWD/public/$base_folder"
dest_folder_path="$PWD/public/$dest_folder"
opts="--minify --platform=browser"

declare -a folders=("utils" "pages")
declare -a subfolders=("Form" "Home")

deno_bundle() {
  if [[ $3 = "Builder.js" ]] ; then
    deno bundle $opts public/$1/pages/$3 -o public/$2/pages/$3
  else
    deno bundle $opts public/$1/$3/* --outdir public/$2/$3/
  fi
}

copy_files_from_base_folder() {
  cp -rf $base_folder_path/* $dest_folder_path
  rm -rf $dest_folder_path/admin
}

if [[ $dest_folder_path ]] ; then
  rm -rf $dest_folder_path/* && copy_files_from_base_folder
else
  mkdir $dest_folder_path && copy_files_from_base_folder
fi

for index in "${!folders[@]}" ; do
  # cannot bundle 'pages' files cause there subfolder in it.
  if [[ ${folders[$index]} != "pages" ]] ; then
	  deno_bundle $base_folder $dest_folder ${folders[$index]}      
  fi

  # handle 'pages' subfolders.
  if [[ ${folders[$index]} = "pages" ]] ; then
    for key in "${!subfolders[@]}" ; do
	    deno_bundle $base_folder $dest_folder ${folders[$index]}/${subfolders[$key]}      
    done
  fi
done

deno_bundle $base_folder $dest_folder "Builder.js"      