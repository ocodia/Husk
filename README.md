# Husk

Default CSS styling for raw HTML elements. No classes required.

Usage:

```
<link rel="stylesheet" href="/css/husk.css">
```

Example: https://ocodia.github.io/husk/
Form example: https://ocodia.github.io/husk/form.html


## To do

- [x] Base HTML element styles 
- [ ] Dark mode
 
---

## Elements

The following HTML elements are styled by Husk. 

1. Text
    1. Headings
    2. Paragraphs
    3. Blockquotes
    4. Lists
    5. Tables
    6. Code
    7. Inline elements
    8. Address
    9. Details
2. Embedded content
    1. Images
    2. Audio
    3. Video
    4. Canvas
    5. Meter
    6. Progress
    7. Inline SVG
    8. IFrames
3. Forms
    1. Input fields
    2. Select menus
    3. Checkboxes
    4. Radio buttons
    5. Textareas
    6. HTML5 inputs
    7. Buttons


### Text
#### Headings
```
<h1>Heading 1</h1>
<h2>Heading 2</h2>
<h3>Heading 3</h3>
<h4>Heading 4</h4>
<h5>Heading 5</h5>
<h6>Heading 6</h6>
```

#### Paragraphs
```
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent ullamcorper ex orci vel sem.</p>
```

#### Blockquotes
```
<blockquote>
    <p>Words can be like X-rays, if you use them properly — they’ll go through anything. You read and you’re pierced.</p>
    <footer>—Aldous Huxley, <cite>Brave New World</cite></footer>
</blockquote>
```

#### Lists
##### Ordered
```
<ol>
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
</ol>
```
##### Unordered
```
<ul>
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
</ul>
```
##### Definition
```
<dl>
    <dt>Beast of Bodmin</dt>
        <dd>A large feline inhabiting Bodmin Moor.</dd>
    <dt>Morgawr</dt>
        <dd>A sea serpent.</dd>
    <dt>Owlman</dt>
        <dd>A giant owl-like creature.</dd>
</dl>
```

#### Tables
```
<table>
    <caption>
        Table Caption
    </caption>
    <thead>
        <tr>
        <th>Heading 1</th>
        <th>Heading 2</th>
        </tr>
    </thead>
    <tfoot>
        <tr>
        <th>Footer 1</th>
        <th>Footer 2</th>
        </tr>
    </tfoot>
    <tbody>
        <tr>
        <td>Cell 1</td>
        <td>Cell 2</td>
        </tr>
    </tbody>
</table>
```
#### Code

##### Keyboard
```
<kbd>Ctrl-F4</kbd>
```

##### Sample output
```
<samp>This is sample output from a computer program</samp>
```

##### Inline code
```      
<code>&lt;div&gt;code&lt;/div&gt;</code>
```

##### Preformatted text
```
<pre>
P R E F O R M A T T E D T E X T
! " # $ % &amp; ' ( ) * + , - . /
0 1 2 3 4 5 6 7 8 9 : ; &lt; = &gt; ?
@ A B C D E F G H I J K L M N O
P Q R S T U V W X Y Z [ \ ] ^ _
` a b c d e f g h i j k l m n o
p q r s t u v w x y z { | } ~ 
</pre>
```

#### Inline elements

##### Links
```
<a href="https://github.com">This is a text link</a>
```

##### Strong

```
<strong>Strong is used to indicate strong importance</strong>
```

##### Emphasis
```
<em>This text has added emphasis</em>
```

##### b
```
The <b>b element</b> is stylistically different text from normal text, without any
special importance
```

##### i
```
The <i>i element</i> is text that is offset from the normal text
```

##### u
```
The <u>u element</u> is text with an unarticulated, though explicitly rendered,
non-textual annotation
```

##### Delete / Insert
```
<del>This text is deleted</del> and <ins>This text is inserted</ins>
```

##### Strikethrough
```
<s>This text has a strikethrough</s>
```

##### Superscript
```
Superscript <sup>®</sup>
```

##### Subscript
```
Subscript C<sub>8</sub>H<sub>10</sub>N<sub>4</sub>O<sub>2</sub>
```

##### Small
```
<small>This small text is small for for fine print, etc</small>
```

##### Abbreviation
```
<abbr title="HyperText Markup Language">HTML</abbr>
```

##### Quote
```
<q cite="https://developer.mozilla.org/en-US/docs/HTML/Element/q">This text is a short inline quotation</q>
```

##### Citation
```
<cite>This is a citation</cite>
```

##### Definition
```
The <dfn>dfn element</dfn> indicates a definition
```

##### Mark
```
The <mark>mark element</mark> indicates a highlight
```

##### Variables
```
The <var>variable element</var>, such as <var>x</var> = <var>y</var>
```

##### Time
```
<time datetime="2013-04-06T12:32+00:00">2 weeks ago</time>
```

#### Address
```
<address>
    <a href="mailto:name@domain.com">name@domain.com</a><br />
    <a href="tel:+441324502030">(+44) 1324 502030</a>
</address>
```
#### Details
```
<details>
    <summary>Some details</summary>
    <p>More info about the details.</p>
</details>

<details open>
    <summary>Even more details</summary>
    <p>Here are even more details about the details.</p>
</details>
```
---

### Embedded content

#### Images
```
<img src="img/image.jpg" alt="Describe the image" />
         
<figure>
    <img src="img/image.jpg" alt="Describe the image" />
    <figcaption>A caption for the image</figcaption>
</figure>
```

#### Audio
```
<audio controls src="audio/audio.mp3">
    Your browser does not support the
    <code>audio</code> element.
</audio>
```

#### Video
```
<video controls>
    <source src="video/video.mp4" type="video/mp4" />
    Sorry, your browser doesn't support embedded videos.
</video>
```

#### Canvas
```
<canvas height="50px">canvas</canvas>
```

#### Meter
```
<meter value="2" min="0" max="10">2 out of 10</meter>
```

#### Progress
```
<progress id="file" max="100" value="70">70%</progress>
```

#### Inline SVG
```
<svg width="100px" height="100px">
    <circle cx="100" cy="100" r="100" fill="#1fa3ec"></circle>
</svg>
```

#### IFrames
```
<iframe src="index.html" height="300px"></iframe>
```

---

### Forms

#### Input fields
```
<label for="input-text">Text input</label>
<input id="input-text" type="text" placeholder="Text Input" />

<label for="input-password">Password input</label>
<input id="input-password" type="password" placeholder="Type your Password" />

<label for="input-url">URL input</label>
<input id="input-url" type="url" placeholder="http://yoursite.com" />

<label for="input-email">Email input</label>
<input id="input-email" type="email" placeholder="name@email.com" />

<label for="input-tel">Telephone input</label>
<input id="input-tel" type="tel" placeholder="(999) 999-9999" />

<label for="input-search">Search input</label>
<input id="input-search" type="search" placeholder="Enter Search Term" />

<label for="input-number">Number Input</label>
<input id="input-number" type="number" placeholder="Enter a Number" />
        
```

#### Select fields
```
<label for="pet-select">Select</label>
<select name="pets" id="pet-select">
    <option value="">Please choose an option</option>
    <option value="dog">Dog</option>
    <option value="cat">Cat</option>
</select>
```

#### Checkboxes
```
<label for="checkbox1">
    <input id="checkbox1" name="checkbox" type="checkbox" checked="checked" /> Choice A
</label>

<label for="checkbox2">
    <input id="checkbox2" name="checkbox" type="checkbox" /> Choice B
</label>

<label for="checkbox3">
    <input id="checkbox3" name="checkbox" type="checkbox" /> Choice C
</label>
```

#### Radio buttons
```
<label for="radio1">
    <input id="radio1" name="radio" type="radio" class="radio" checked="checked" /> Option 1
</label>

<label for="radio2">
    <input id="radio2" name="radio" type="radio" class="radio" /> Option 2
</label>

<label for="radio3">
    <input id="radio3" name="radio" type="radio" class="radio" /> Option 3
</label>
```

#### Textareas
```
<textarea id="textarea" rows="8" cols="48" placeholder="Enter your message here"></textarea>
```

#### HTML5 inputs
```
<label for="input-colour">Color input</label>
<input type="color" id="input-colour" value="#000000" />

<label for="input-number">Number input</label>
<input type="number" id="input-number" min="0" max="10" value="5" />

<label for="input-range">Range input</label>
<input type="range" id="input-range" value="10" />

<label for="input-date">Date input</label>
<input type="date" id="input-date" value="1970-01-01" />

<label for="input-datetime-month">Month input</label>
<input type="month" id="input-datetime-month" value="1970-01" />

<label for="input-datetime-week">Week input</label>
<input type="week" id="input-datetime-week" value="1970-W01" />

<label for="input-datetime">Datetime input</label>
<input type="datetime" id="input-datetime" value="1970-01-01T00:00:00Z" />

<label for="input-datetime-local">Datetime-local input</label>
<input type="datetime-local" id="input-datetime-local" value="1970-01-01T00:00" />

<label for="input-file">Choose a profile picture:</label>
<input type="file" id="input-file" name="input-file" accept="image/png, image/jpeg" />
              
```

#### Buttons
```
<input type="button" value="<input type=button>" />
<input type="submit" value="<input type=submit>" />
<input type="reset" value="<input type=reset>" />
<input type="submit" value="<input disabled>" disabled />

<button type="button">Button</button>
<button type="submit">Submit button</button>
<button type="reset">Reset button</button>
<button type="button" disabled>Disabled button</button>
```
