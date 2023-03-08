
(function () {
  const up = $('.upload1'),
        upIpt = $('.fileIpt'),
        selectBtn = $('.selectFile'),
        uploadBtn = $('.uploadBtn'),
        tips = $('.tips'),
        list = $('.fileList');

  let _file = null;

  const changeDisable = (flag) => {
    if(flag){
      selectBtn.addClass('disable')
      uploadBtn.addClass('loading')
      return
    }else{
      selectBtn.removeClass('disable')
      uploadBtn.removeClass('loading')
    }
  }

  const clearHandle = () => {
    _file = null
    tips.show()
    list.hide()
    list.html('')
  }


  // 9. 上传文件到服务器
  uploadBtn.click(async (e) => {
    if(document.querySelector('.uploadBtn').classList.contains('disable') || document.querySelector('.uploadBtn').classList.contains('loading'))
    return
    if(!_file)return alert('请您先选择要上传的文件')

    // 把按钮加对应的类名
    changeDisable(true)

    // 把文件传输到服务器 FormData / BASE64
    const fm = new FormData();
    fm.append('file', _file) // 后端需要的数据 file
    fm.append('filename', _file.name) // filename 
    try {
      const res = await http.post('/upload_single',fm)
      if(res.code === 0){
        alert(`${res.codeText},您可以基于${res.url}访问图片`)
        return 
      }
      return Promise.reject(data.codeText);
    } catch (error) {
      alert('上传文件失败,请稍后再试')
    }finally{
      clearHandle()
      changeDisable(false)
    }
  })



  // 8. 移除按钮的点击处理  事件委托来处理移除 因为一开始没有em 元素 只有选中文件才会有em 
  list.click((e) => { 
    const elName = e.target.tagName
    if(elName === 'EM'){
      // 点击的是移除
      clearHandle()
    }
  })

  // 2. 监听用户选择文件的操作
  upIpt.change((e) => {
    // 3. 获取用户选中的文件
    /* 
      name: 文件名
      size: 文件尺寸
      type: 文件类型
    */
    const file = e.target.files[0]
    if(!file) return 

    // 4. 限制文件上传的格式  方案1 基于 js 处理
    if(!/(PNG|JPG|JPEG)/i.test(file.type)){
      alert('上传的文件只能是 png/jpg/jpeg 格式的--')
      return 
    }
    // 方案2 表单元素上面处理 限制选择文件的类型

    // 5. 限制上传文件的大小
    if(file.size > 2 * 1024 * 1024){
      alert('上传的文件只能是2MB的大小--')
      return
    }
    // 把file 存到全局变量
    _file = file;

    // 6. 控制 隐藏提示tips 文件列表显示
    tips.hide()
    list.show()

    // 7. 显示上传选中的文件
    list.html(`
      <li class="item">
        <span>文件: ${file.name}</span>
        <span><em>移除</em></span>
      </li>
    `)
  })

  // 1. 点击选择文件按钮， 触发上传文件的输入框
  selectBtn.click(() => {
    if(document.querySelector('.selectFile').classList.contains('disable') || document.querySelector('.selectFile').classList.contains('loading'))
    return

    upIpt.click()
  })

  
  let fm = new FormData;
  fm.append('file', '')
  fm.append('filename', '')
 
})()


// 基于base64 实现文件上传
(function () {
  const 
        upIpt = $('.upload2 .fileIpt'),
        selectBtn = $('.upload2 .selectFile');

  // 验证是否处于可操作性状态
  const isCheckDisabel = el => {
    if(document.querySelector(el).classList.contains('disable') || document.querySelector(el).classList.contains('loading'))
    return true
  }


  // 2. 监听用户选择文件的操作
  upIpt.change((e) => {
    // 3. 获取用户选中的文件
    /* 
      name: 文件名
      size: 文件尺寸
      type: 文件类型
    */
    const file = e.target.files[0]
    if(!file) return 

    // 4. 限制文件上传的格式  方案1 基于 js 处理
    if(!/(PNG|JPG|JPEG)/i.test(file.type)){
      alert('上传的文件只能是 png/jpg/jpeg 格式的--')
      return 
    }
    // 方案2 表单元素上面处理 限制选择文件的类型

    // 5. 限制上传文件的大小
    if(file.size > 2 * 1024 * 1024){
      alert('上传的文件只能是2MB的大小--')
      return
    }

    // 6. 控制 隐藏提示tips 文件列表显示
    tips.hide()
    list.show()

    // 7. 显示上传选中的文件
    list.html(`
      <li class="item">
        <span>文件: ${file.name}</span>
        <span><em>移除</em></span>
      </li>
    `)
  })

  // 1. 点击选择文件按钮， 触发上传文件的输入框
  selectBtn.click(() => {
    if(isCheckDisabel('.selectBtn'))return
    upIpt.click();
  })

  
  let fm = new FormData;
  fm.append('file', '')
  fm.append('filename', '')
 
})()