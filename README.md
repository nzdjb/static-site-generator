# static-website-generator

A website generator. This is intended mostly for my own use, but you're welcome to use it too!

## Usage

At present, a directory and two files are needed:

* The config directory should contain toml files similar to the following:
  ```toml
  [[articles]]
  title = "Article title"
  date = 2023-01-01
  content = "Article content"
  author = "Article author"
  published = true
  ```
  * author and published are optional, defaulting to empty string and true, respectively.
  * content supports Markdown.
* A template file, which should be a Handlebars HTML file.
* An output file, which will be the location the output is written.

Invocation is done as follows:
```bash
static-site-generator --config <path-to-config> --indexTemplate <path-to-template-file> --outFile <path-to-output-file>
```

This command is highly subject to change!
