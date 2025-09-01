# Creative Coding Amsterdam

* [Website](https://cca.codes)
* [Meetup group](https://www.meetup.com/creative-coding-amsterdam/)
* [Discord](https://discord.gg/eJJvn3487M)

## Logo

You can find all of the files [here](./logo/).

### SVG

||Plain|With red accent|
|-|-|-|
|Black|![Black SVG logo](./logo/svg/black.svg)|![Black SVG logo with red accent](./logo/svg/black-red.svg)|
|White|![White SVG logo](./logo/svg/white.svg)|![White SVG logo with red accent](./logo/svg/white-red.svg)|

### PNG

||Plain|With red accent|
|-|-|-|
|Black|![Black logo](./logo/png/black.png)|![Black logo with red accent](./logo/png/black-red.png)|
|White|![White logo](./logo/png/white.png)|![White logo with red accent](./logo/png/white-red.png)|

## Website

For the website use [Zola](https://www.getzola.org/) static site generator. All of the files are in [website](./website) folder.

To run the site locally:

- [Install Zola](https://www.getzola.org/documentation/getting-started/installation/)
- Navigate to [website](./website) folder in your terminal
- Run `zola serve` (if you want to test it on your local network add `--interface 0.0.0.0`)
- Open [localhost:1111/](http://localhost:1111/)

Deployments are automated using [GitHub actions](./.github/workflows/gh-pages.yaml) and deployed to GitHub Pages.

### TODO

* [x] Setup CI
* [x] Basic documentation
* [ ] Collaboration document
* [x] Add title to the homepage
* [x] Add title to the invaders page
* [x] Spotlight item data model
* [x] Remove spotlight URLs from sitemap.xml
* [x] Pause button on the spotlight video
* [x] Page template (basic version is done, we'll add more components as we go)
* [x] Events page
* [x] Events page copy
* [x] About page
* [x] About page copy
* [x] 404 page
* [x] Code challenge template - reused the page template with custom components
* [ ] Clean up / organize SCSS a bit better (WIP)
* [ ] Contact modal - switch to discrete transitions instead of animations
* [x] Mobile menu
* [x] Footer copy
* [x] Dark theme
* [x] Metadata image template
* [x] Remove unused fonts
* [x] Group images in the static folder
* [x] Add a checkbox to disable the hover effect
