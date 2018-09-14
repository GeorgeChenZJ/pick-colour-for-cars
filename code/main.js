;(function(){

  var NUM = 2652

  var link_items = []
  var where = -1
  var addItem = function(item){
    if(link_items[where]!=item){
      where += 1
      link_items[where] = item
    }
  }
  var nextItem = function(){
    if(link_items[where+1]){
      where += 1
      return link_items[where]
    }else{
      var item = findNextUndone()
      addItem(item)
      return item
    }
  }
  var lastItem = function(){
    if(link_items[where-1]){
      where -= 1
      return link_items[where]
    }else{
      var item = findNextUndone()
      addItem(item)
      return item
    }
  }
  var findNextUndone = function(){
    for (var i = 0; i < NUM; i++) {
      var item = document.getElementById('item_'+i)
      if(item.className.indexOf('done')==-1){
        return item
      }
    }
    alert('All items finished. Well done!')
    return item
  }

  var xmlhttp = new XMLHttpRequest()
  var colour_dict
  xmlhttp.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
      colour_dict = JSON.parse(this.responseText)
    }
  }
  xmlhttp.open('GET', 'colours.json', true)
  xmlhttp.send()

  var setItemColour = function(item, colour){
    item._colour = colour.slice()
    var c_s = 'rgba('+colour[0]+','+colour[1]+','+colour[2]+')'
    item.getElementsByClassName('item-colour')[0].style.backgroundColor = c_s
    var current_display = document.getElementById('display_current_colour')
    current_display.style.backgroundColor = c_s
    if (item.className.indexOf('done') == -1){
      item.className += ' done'
    }
    if (current_display.className.indexOf('done') == -1){
      current_display.className += ' done'
    }
    var colourObj = localStorage.getItem('colourObj');
    colourObj = JSON.parse(colourObj)
    var id = item.id
    id = id.split('_')[1]
    if(colourObj){
      colourObj[id] = colour
    }else{
      colourObj = {
        id: colour
      }
    }
    localStorage.setItem('colourObj', JSON.stringify(colourObj));
  }

  var selectItem = function(e){
    var item = this

    if(link_items[where]!=item){
      addItem(item)
    }

    var img = this.getElementsByClassName('item-thumbnail')[0].cloneNode(true)

    img.className = 'viewing-thumbnail'
    var viewImg = document.getElementById('display_thumbnail')
    viewImg.innerHTML = ''
    viewImg.appendChild(img)

    if(!colour_dict){
      window.alert("Something's wrong! 'colour_dict' not found.")
      return
    }

    var name = item.id.split('_')[1] + '.jpg'
    var colours = colour_dict[name]

    var current_colour_bar = document.getElementById('display_current_colour')
    if(item._colour){
      var _rgb = item._colour
      current_colour_bar.style.backgroundColor = 'rgba('+_rgb[0]+','+_rgb[1]+','+_rgb[2]+')'
    }else{
      current_colour_bar.style.backgroundColor = 'transparent'
      current_colour_bar.className = current_colour_bar.className.replace(' done')
    }

    var colourBtnGroup = document.getElementById('display_colours')
    colourBtnGroup.innerHTML = ''
    for (var i = 0; i < 5; i++) {
      var btn = document.createElement('div')
      btn.className = 'viewing-btn'
      var rgb = colours[i]
      btn.style.backgroundColor = 'rgba('+rgb[0]+','+rgb[1]+','+rgb[2]+')'
      btn._colour = rgb.slice()
      colourBtnGroup.appendChild(btn)
      btn.onclick = function(e){
        var colour =  this._colour
        setItemColour(item, colour)
      }
    }
  }

  window.onload = function(){
    var display_area = document.getElementById('display_all')
    for (var i = 0; i < NUM; i++) {
      var img = new Image()
      img.src = 'thumbnails/'+i+'.jpg'
      img.className = 'item-thumbnail'

      var id = document.createElement('span')
      id.className = 'item-id'
      id.innerHTML = i
      var item = document.createElement('div')
      item.className = 'item'
      item.id = 'item_'+i
      var colour = document.createElement('div')
      colour.className = 'item-colour'

      item.onclick = function(e){
        selectItem.call(this, e)
      }
      item.appendChild(id)
      item.appendChild(img)
      item.appendChild(colour)
      display_area.appendChild(item)
    }

    document.getElementById('last').onclick = function(){
      selectItem.call(lastItem())
    }
    document.getElementById('next').onclick = function(){
      selectItem.call(nextItem())
    }

    document.getElementById('download').onclick = function(){
      var colourObj = localStorage.getItem('colourObj');
      var dataStr = "data:text/json;charset=utf-8,"+encodeURIComponent(colourObj)
      var anc = document.createElement('a')
      anc.setAttribute('href', dataStr)
      anc.setAttribute('download', 'colour_labelled.json')
      document.body.appendChild(anc)
      anc.click()
      anc.remove()
    }
    document.getElementById('clear').onclick = function(){
      var cf = window.confirm('Are you sure to clear all labelled data? 真的要删除已标记的记录吗？')
      if(cf){
        var colourObj = localStorage.getItem('colourObj');
        localStorage.setItem('recoverColourObj', colourObj)
        localStorage.setItem('colourObj', JSON.stringify({message: "n"}))
      }
    }
    var colourObj = localStorage.getItem('colourObj')
    if(colourObj){
      colourObj = JSON.parse(colourObj)
      for(var key in colourObj){
        if(!colourObj.hasOwnProperty(key)) continue
        if(key=='message') continue
        var colour = colourObj[key]
        var item = document.getElementById('item_'+key)
        item._colour = colour.slice()
        var c_s = 'rgba('+colour[0]+','+colour[1]+','+colour[2]+')'
        item.getElementsByClassName('item-colour')[0].style.backgroundColor = c_s
        if (item.className.indexOf('done') == -1){
          item.className += ' done'
        }
      }
      selectItem.call(nextItem())

    }else{
      localStorage.setItem('colourObj', JSON.stringify({message: "n"}))
    }
  }




})()
