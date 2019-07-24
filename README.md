# Game of Decryption

Takes an image, reads and deciphers text.

Demo: https://ist440-game-of-decryption.netlify.com/

### Login:

Username: `student`

Password: `ist440`

### Developers

`git pull https://github.com/lazorfuzz/game-of-decryption`

`cd game-of-decryption`

`yarn` or `npm install`

`yarn start` or `npm start`

# Documentation

<a name="App"></a>

## App ⇐ <code>Component</code>
**Kind**: global class  
**Extends**: <code>Component</code>  
<a name="new_App_new"></a>

### new App()
The base component where we initialize our app tree.


## Functions - api.js

<dl>
<dt><a href="#login">login(username, password)</a> ⇒</dt>
<dd><p>Handles login POST</p>
</dd>
<dt><a href="#signup">signup(username, email, password, org_id)</a> ⇒</dt>
<dd><p>Handles sign up POST</p>
</dd>
<dt><a href="#getUser">getUser([id])</a> ⇒</dt>
<dd><p>Gets user information by ID</p>
</dd>
<dt><a href="#setUser">setUser(id, [method], [form])</a> ⇒</dt>
<dd><p>CRUD method for user by ID</p>
</dd>
<dt><a href="#checkCipherSolutionExists">checkCipherSolutionExists(cipher)</a> ⇒</dt>
<dd><p>Handles cipher solution check POST</p>
</dd>
<dt><a href="#getSavedSolutions">getSavedSolutions()</a> ⇒</dt>
<dd><p>Handles saved solutions fetch</p>
</dd>
<dt><a href="#addSavedSolution">addSavedSolution(cipher, lang, solution)</a> ⇒</dt>
<dd><p>Create a new saved solution POST</p>
</dd>
<dt><a href="#setSavedSolution">setSavedSolution(id, [method], [form])</a> ⇒</dt>
<dd><p>CRUD method for saved solution by ID</p>
</dd>
<dt><a href="#getOrganization">getOrganization([name])</a> ⇒</dt>
<dd><p>Fetch an organization or list of organizations</p>
</dd>
<dt><a href="#setOrganization">setOrganization(name, [method], [form])</a> ⇒</dt>
<dd><p>CRUD method for organization by name</p>
</dd>
<dt><a href="#solveCipher">solveCipher(cipher, [lang])</a> ⇒</dt>
<dd><p>Handles cipher solve request POST</p>
</dd>
<dt><a href="#getNews">getNews([query])</a> ⇒</dt>
<dd><p>Fetch the news by a specific query</p>
</dd>
</dl>

<a name="login"></a>

## login(username, password) ⇒
Handles login POST

**Kind**: global function  
**Returns**: Response  

| Param | Type |
| --- | --- |
| username | <code>string</code> | 
| password | <code>string</code> | 

<a name="signup"></a>

## signup(username, email, password, org_id) ⇒
Handles sign up POST

**Kind**: global function  
**Returns**: Response  

| Param | Type |
| --- | --- |
| username | <code>string</code> | 
| email | <code>string</code> | 
| password | <code>string</code> | 
| org_id | <code>number</code> | 

<a name="getUser"></a>

## getUser([id]) ⇒
Gets user information by ID

**Kind**: global function  
**Returns**: Response  

| Param | Type | Default |
| --- | --- | --- |
| [id] | <code>number</code> | <code>1</code> | 

<a name="setUser"></a>

## setUser(id, [method], [form]) ⇒
CRUD method for user by ID

**Kind**: global function  
**Returns**: Response  

| Param | Type | Default |
| --- | --- | --- |
| id | <code>\*</code> |  | 
| [method] | <code>string</code> | <code>&quot;&#x27;POST&#x27;&quot;</code> | 
| [form] | <code>object</code> | <code>{}</code> | 

<a name="checkCipherSolutionExists"></a>

## checkCipherSolutionExists(cipher) ⇒
Handles cipher solution check POST

**Kind**: global function  
**Returns**: Response  

| Param | Type | Description |
| --- | --- | --- |
| cipher | <code>string</code> | The text read by the OCR engine |

<a name="getSavedSolutions"></a>

## getSavedSolutions() ⇒
Handles saved solutions fetch

**Kind**: global function  
**Returns**: Response  
<a name="addSavedSolution"></a>

## addSavedSolution(cipher, lang, solution) ⇒
Create a new saved solution POST

**Kind**: global function  
**Returns**: Response  

| Param | Type | Description |
| --- | --- | --- |
| cipher | <code>string</code> | The text returned by the OCR engine |
| lang | <code>string</code> | The two-letter language code |
| solution | <code>string</code> | The deciphered text |

<a name="setSavedSolution"></a>

## setSavedSolution(id, [method], [form]) ⇒
CRUD method for saved solution by ID

**Kind**: global function  
**Returns**: Response  

| Param | Type | Default |
| --- | --- | --- |
| id | <code>number</code> |  | 
| [method] | <code>string</code> | <code>&quot;&#x27;PUT&#x27;&quot;</code> | 
| [form] | <code>object</code> | <code>{}</code> | 

<a name="getOrganization"></a>

## getOrganization([name]) ⇒
Fetch an organization or list of organizations

**Kind**: global function  
**Returns**: Response  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [name] | <code>string</code> | <code>&quot;&#x27;all&#x27;&quot;</code> | Organization name. Defaults to all |

<a name="setOrganization"></a>

## setOrganization(name, [method], [form]) ⇒
CRUD method for organization by name

**Kind**: global function  
**Returns**: Response  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| name | <code>\*</code> |  | The organization's name |
| [method] | <code>string</code> | <code>&quot;&#x27;POST&#x27;&quot;</code> |  |
| [form] | <code>\*</code> | <code>{}</code> |  |

<a name="solveCipher"></a>

## solveCipher(cipher, [lang]) ⇒
Handles cipher solve request POST

**Kind**: global function  
**Returns**: Response  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| cipher | <code>string</code> |  | The text read by the OCR engine |
| [lang] | <code>string</code> | <code>&quot;&#x27;idk&#x27;&quot;</code> | The language dictionary to look up with. Defaults to 'idk' |

<a name="getNews"></a>

## getNews([query]) ⇒
Fetch the news by a specific query

**Kind**: global function  
**Returns**: Response  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [query] | <code>string</code> | <code>&quot;&#x27;_org&#x27;&quot;</code> | The search query. Defaults to the user's organization name |

## Functions - components/Home/read-iamge.js

<dl>
<dt><a href="#detectLanguage">detectLanguage(image, progressCallback)</a> ⇒</dt>
<dd><p>Detect the language used in the image</p>
</dd>
<dt><a href="#readImage">readImage(image, progressCallback)</a> ⇒</dt>
<dd><p>Reads the image with tesseract.js</p>
</dd>
</dl>

<a name="detectLanguage"></a>

## detectLanguage(image, progressCallback) ⇒
Detect the language used in the image

**Kind**: global function  
**Returns**: Currently returns a reading of "NULL" for everything. Don't use  

| Param | Type | Description |
| --- | --- | --- |
| image | <code>File</code> |  |
| progressCallback | <code>\*</code> | The handler for when tesseract.js emits a progress event |

<a name="readImage"></a>

## readImage(image, progressCallback) ⇒
Reads the image with tesseract.js

**Kind**: global function  
**Returns**: Promise -> result object  

| Param | Type | Description |
| --- | --- | --- |
| image | <code>File</code> |  |
| progressCallback | <code>func</code> | The handler for when tesseract.js emits a progress event |
