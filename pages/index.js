const delay = (intval) => {
  typeof intval !== 'number' ? intval = 1000 : null
  return new Promise((res, rej) => {
    setTimeout(() => {
      res()
    }, intval);
  })
}


(function () {
  const
    upIpt = $('.upload1 .fileIpt'),
    selectBtn = $('.upload1 .selectFile'),
    uploadBtn = $('.upload1 .uploadBtn'),
    tips = $('.upload1 .tips'),
    list = $('.upload1 .fileList');

  let _file = null;

  const changeDisable = (flag) => {
    if (flag) {
      selectBtn.addClass('disable')
      uploadBtn.addClass('loading')
      return
    } else {
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
    if (document.querySelector('.upload1 .uploadBtn').classList.contains('disable') || document.querySelector('.upload1 .uploadBtn').classList.contains('loading'))
      return
    if (!_file) return alert('请您先选择要上传的文件')

    // 把按钮加对应的类名
    changeDisable(true)

    // 把文件传输到服务器 FormData / BASE64
    const fm = new FormData();
    fm.append('file', _file) // 后端需要的数据 file
    fm.append('filename', _file.name) // filename 
    try {
      const res = await http.post('/upload_single', fm)
      if (res.code === 0) {
        alert(`${res.codeText},您可以基于${res.url}访问图片`)
        return
      }
      return Promise.reject(data.codeText);
    } catch (error) {
      alert('上传文件失败,请稍后再试')
    } finally {
      clearHandle()
      changeDisable(false)
    }
  })



  // 8. 移除按钮的点击处理  事件委托来处理移除 因为一开始没有em 元素 只有选中文件才会有em 
  list.click((e) => {
    const elName = e.target.tagName
    if (elName === 'EM') {
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
    if (!file) return

    // 4. 限制文件上传的格式  方案1 基于 js 处理
    if (!/(PNG|JPG|JPEG)/i.test(file.type)) {
      alert('上传的文件只能是 png/jpg/jpeg 格式的--')
      return
    }
    // 方案2 表单元素上面处理 限制选择文件的类型

    // 5. 限制上传文件的大小
    if (file.size > 2 * 1024 * 1024) {
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
    if (document.querySelector('.upload1 .selectFile').classList.contains('disable') || document.querySelector('.upload1 .selectFile').classList.contains('loading'))
      return

    upIpt.click()
  })

})();


// 基于base64 实现文件上传
(function () {
  const
    upIpt = $('.upload2 .fileIpt'),
    selectBtn = $('.upload2 .selectFile');

  // 验证是否处于可操作性状态
  const isCheckDisable = el => {
    // if(document.querySelector(el).classList.contains('disable') || document.querySelector(el).classList.contains('loading'))
    // {return true}
  }


  // 把选取的文件 转换成 base64 
  const changeBase64 = file => {
    return new Promise((res, rej) => {
      let fileReader = new FileReader();

      fileReader.readAsDataURL(file)
      fileReader.onload = (e) => {
        res(e.target.result)
      }
    })
  }

  const changeDisable = (flag) => {
    if (flag) {
      selectBtn.addClass('disable')
      return
    } else {
      selectBtn.removeClass('disable')
    }
  }


  // 2. 监听用户选择文件的操作
  upIpt.change(async (e) => {
    // 3. 获取用户选中的文件
    /* 
      name: 文件名
      size: 文件尺寸
      type: 文件类型
    */
    let file = e.target.files[0]
    if (!file) return

    // 4. 限制文件上传的格式  方案1 基于 js 处理
    if (!/(PNG|JPG|JPEG)/i.test(file.type)) {
      alert('上传的文件只能是 png/jpg/jpeg 格式的--')
      return
    }
    // 方案2 表单元素上面处理 限制选择文件的类型

    // 5. 限制上传文件的大小
    if (file.size > 2 * 1024 * 1024) {
      alert('上传的文件只能是2MB的大小--')
      return
    }
    changeDisable(true)
    const base64 = await changeBase64(file)

    try {
      const data = await http.post('/upload_single_base64',
        {
          file: encodeURIComponent(base64), // 防止乱码问题
          filename: file.name,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      const { code } = data;
      if (code === 0) {
        alert('文件上传成功!');
      } else {
        throw data.codeText; // 抛出异常
      }
    } catch (error) {
      alert('上传失败')
    } finally {
      changeDisable(false)
    }
  })

  // 1. 点击选择文件按钮， 触发上传文件的输入框
  selectBtn.click(() => {
    // if(isCheckDisable('.selectBtn'))return
    upIpt.click();
  })
})();


// 缩略图 自动生成名字
(function () {
  const
    upIpt = $('.upload3 .fileIpt'),
    selectBtn = $('.upload3 .selectFile'),
    uploadBtn = $('.upload3 .uploadBtn'),
    abbre = $('.upload3 .abbre'),
    abbreImg = $('.upload3 .abbre img');
  abbreImg.hide()

  let _file = null;

  // 把选取的文件 转换成 base64 
  const changeBase64 = file => {
    return new Promise((res, rej) => {
      let fileReader = new FileReader();

      fileReader.readAsDataURL(file)
      fileReader.onload = (e) => {
        res(e.target.result)
      }
    })
  }

  const changeDisable = (flag) => {
    if (flag) {
      selectBtn.addClass('disable')
      return
    } else {
      selectBtn.removeClass('disable')
    }
  }

  const changeBuffer = (file) => {
    return new Promise((res) => {
      let fileReader = new FileReader()
      fileReader.readAsArrayBuffer(file)
      fileReader.onload = (e) => {
        let buffer = e.target.result
        const spark = new SparkMD5.ArrayBuffer();
        spark.append(buffer);
        const HASH = spark.end();
        const suffix = /\.([0-9a-zA-Z]+)$/.exec(file.name)[1];
        res({
          buffer,
          HASH,
          suffix,
          filename: `${HASH}.${suffix}`,
        })
      }
    })
  }


  // 上传到服务器
  uploadBtn.click(async () => {
    // if(isCheckDisable('.upload3 .selectBtn'))return
    if (!_file) return alert('请先选择要上传的文件')
    changeDisable(true)

    // 生成文件的hash名字
    const { filename } = await changeBuffer(_file)
    console.log('filename', filename)
    let fm = new FormData();
    fm.append('file', _file)
    fm.append('filename', filename)

    try {
      const res = await http.post('/upload_single_name', fm)
      const { code } = res;
      if (code === 0) {
        alert('file 上传成功');
        return;
      }
      console.log(res);
      return Promise.reject(data.codeText);
    } catch (error) {
      alert('上传失败')
    } finally {
      changeDisable(false)
      abbreImg.hide()
      abbreImg.attr('src', '')
      file = null
    }
  })

  // 2. 监听用户选择文件的操作  预览
  upIpt.change(async (e) => {
    // 3. 获取用户选中的文件
    /* 
      name: 文件名
      size: 文件尺寸
      type: 文件类型
    */
    let file = e.target.files[0]
    if (!file) return
    _file = file
    // 4. 限制文件上传的格式  方案1 基于 js 处理
    if (!/(PNG|JPG|JPEG)/i.test(file.type)) {
      alert('上传的文件只能是 png/jpg/jpeg 格式的--')
      return
    }
    // 方案2 表单元素上面处理 限制选择文件的类型

    // 5. 限制上传文件的大小
    if (file.size > 2 * 1024 * 1024) {
      alert('上传的文件只能是2MB的大小--')
      return
    }
    changeDisable(true)


    // 文件预览 转化为 base64 
    let base64 = await changeBase64(file)
    // 文件预览
    abbreImg.show()
    abbreImg.attr('src', base64)
    changeDisable(false)
  })

  // 1. 点击选择文件按钮， 触发上传文件的输入框
  selectBtn.click(() => {
    // if(isCheckDisable('.selectBtn'))return
    upIpt.click();
  })
})();


// 进度管控
(function () {
  const
    upIpt = $('.upload4 .fileIpt'),
    selectBtn = $('.upload4 .selectFile'),
    val = $('.upload4 .value'),
    text = $('.upload4 .text');



  const changeDisable = flag => {
    if (flag) {
      selectBtn.addClass('loading')
    } else {
      selectBtn.removeClass('loading')
    }
  }



  // 2. 监听用户选择文件的操作  预览
  upIpt.change(async (e) => {
    // 3. 获取用户选中的文件
    /* 
      name: 文件名
      size: 文件尺寸
      type: 文件类型
    */
    let file = e.target.files[0]
    if (!file) return
    // 4. 限制文件上传的格式  方案1 基于 js 处理
    if (!/(PNG|JPG|JPEG)/i.test(file.type)) {
      alert('上传的文件只能是 png/jpg/jpeg 格式的--')
      return
    }
    // 方案2 表单元素上面处理 限制选择文件的类型

    // 5. 限制上传文件的大小
    // if (file.size > 4 * 1024 * 1024) {
    //   alert('上传的文件只能是4MB的大小--')
    //   return
    // }
    // changeDisable(true)


    const fm = new FormData()
    fm.append('file', file)
    fm.append('filename', file.name)

    try {
      const res = await http.post('/upload_single', fm, {
        onUploadProgress: (e) => {
          const { loaded, total } = e;
          val.css('width', `${(loaded / total) * 100
            }%`)
          text.html(`上传${parseInt((loaded / total) * 100)}%`)

        },
      })
      const { code } = res;
      if (code == 0) {
        text.html(`上传100%`)
        await delay(300)
        alert('文件上传成功!');
        return;
      } else {
        throw data.codeText;
      }
    } catch (error) {
      alert('文件上传失败');
    } finally {
      // changeDisable(false)

      file = null
    }



    // changeDisable(false)

    e.preventDefault();
  })

  // 1. 点击选择文件按钮， 触发上传文件的输入框
  selectBtn.click(() => {
    // if(isCheckDisable('.selectBtn'))return
    upIpt.click();
  })
})();


// 多文件上传
(function () {
  const
    upIpt = $('.upload5 .fileIpt'),
    selectBtn = $('.upload5 .selectFile'),
    uploadBtn = $('.upload5 .uploadBtn'),
    list = $('.upload5 .list');

  let _files = [];


  const changeDisable = (flag) => {
    if (flag) {
      selectBtn.addClass('disable')
      return
    } else {
      selectBtn.removeClass('disable')
    }
  }


  // 实现移除文件
  list.click(e => {
    let key;
    if (e.target.tagName === 'EM') {
      curLi = e.target.parentNode.parentNode
      if (!curLi) return
      key = curLi.getAttribute('key')
      curLi.remove()
      _files = _files.filter(i => i.key !== key)
    }
  })

  // 上传到服务器
  uploadBtn.click(async () => {
    // if(isCheckDisable('.upload3 .selectBtn'))return
    if (!_files) return alert('请先选择要上传的文件')
    changeDisable(true)

    // 循环发送请求
    const curLiArr = Array.from(document.querySelectorAll('.upload5 .list li'))
    _files = _files.map(i => {
      let fm = new FormData(),
        // li 上面的key  和 _file 每个对象里面的key 做比较 相同的就是当前的li
        curLi = curLiArr.find(li => li.getAttribute('key') == i.key),
        curSpan = curLi ? curLi.querySelector('.remove') : null;
      console.log('curSpan', curSpan)
      fm.append('file', i.file)
      fm.append('filename', i.filename)
      return http.post('/upload_single', fm, {
        onUploadProgress(e) {
          // 检测每一个上传的进度
          if (curSpan)
            curSpan.innerHTML = `${(e.loaded / e.total * 100).toFixed(2)}%`
        }
      }).then(async res => {
        if (+res.code === 0) {
          await delay(300)
          if (curSpan) curSpan.innerHTML = `100%`
          // return alert('上传成功')
          return
        }
        return Promise.reject()
      })
    })

    // 等待所有处理结果
    Promise.all(_files).then(res => {
      alert('上传成功')
    }).catch(() => {
      alert('上传失败')
    }).finally(() => {
      changeDisable(false)
      _files = []
    })
  })

  // 2. 监听用户选择文件的操作  预览
  upIpt.change(async (e) => {
    // 3. 获取用户选中的文件
    /* 
      name: 文件名
      size: 文件尺寸
      type: 文件类型
    */
    _files = Array.from(e.target.files)
    if (!_files.length) return
    /**
     * 生成随机数
     * @returns
     */
    const createRandom = () => {
      let ran = Math.random() * new Date()
      // 变成 16进制的结果  替换 .
      return ran.toString(16).replace('.', '')
    }

    _files = _files.map(i => {
      return {
        file: i,
        filename: i.name,
        key: createRandom()
      }
    })
    let str = ''
    _files.forEach((item, idx) => {
      str += `
        <li key="${item.key}">
          <span class="info">文件${idx + 1}: ${item.filename}</span>
          <span class="remove"><em>移除</em></span>
        </li>
      `
    });
    list.html(str)
    changeDisable(true)



    changeDisable(false)
  })

  // 1. 点击选择文件按钮， 触发上传文件的输入框
  selectBtn.click(() => {
    // if(isCheckDisable('.selectBtn'))return
    upIpt.click();
  })
})();

// 拖拽上传
(function () {
  const upload = document.querySelector('.upload6')
  upIpt = document.querySelector('.upload6 .fileIpt'),
    submit = document.querySelector('.upload6 .dragtips'),
    mark = document.querySelector('.upload6 .mark');

  let isRun = false;

  // 文件上传
  const uploadFile = async file => {
    // 如果正在上传 ，就什么都不做
    if (isRun) return;
    isRun = true
    mark.style.display = 'block';
    try {
      let fm = new FormData();
      fm.append('file', file)
      fm.append('filename', file.name)
      const res = await http.post('/upload_single', fm)
      if (+res.code == 0) {
        alert('上传成功')
      } else {
        throw data.codeText
      }
    } catch (error) {
      alert('上传失败')
    } finally {
      mark.style.display = 'none';
      isRun = false
    }
  }

  // 拖拽获取文件 dragenter dragleave dragover drop
  // 进入
  upload.addEventListener('dragenter', (e) => {
  })
  // 离开
  upload.addEventListener('dragleave', (e) => {
  })
  // 移动
  upload.addEventListener('dragover', (e) => {
    e.preventDefault()
  })
  // 离开
  upload.addEventListener('drop', (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (!file) return
    uploadFile(file)

  })


  // 手动选择文件
  upIpt.onchange = (e) => {
    let file = e.target.files[0]
    if (!file) return alert('请上传')
    uploadFile(file)
  }

  submit.onclick = e => {
    upIpt.onclick()
  }


})();

// 大文件上传
(function () {
  const
    upIpt = $('.upload7 .fileIpt'),
    selectBtn = $('.upload7 .selectFile'),
    val = $('.upload7 .value'),
    text = $('.upload7 .text'),
    progress = $('.upload7 .progress');


  const changeBuffer = (file) => {
    return new Promise((res) => {
      let fileReader = new FileReader()
      fileReader.readAsArrayBuffer(file)
      fileReader.onload = (e) => {
        let buffer = e.target.result
        const spark = new SparkMD5.ArrayBuffer();
        spark.append(buffer);
        const HASH = spark.end();
        const suffix = /\.([0-9a-zA-Z]+)$/.exec(file.name)[1];
        res({
          buffer,
          HASH,
          suffix,
          filename: `${HASH}.${suffix}`,
        })
      }
    })
  }

  const changeDisable = flag => {
    if (flag) {
      selectBtn.addClass('loading')
    } else {
      selectBtn.removeClass('loading')
    }
  }

  // 2. 监听用户选择文件的操作  预览
  upIpt.change(async (e) => {
    // 3. 获取用户选中的文件
    let file = e.target.files[0]
    if (!file) return
    // changeDisable(true)

    // 获取文件的hash
    let { HASH, suffix } = await changeBuffer(file)
    let already = []

    try {
      // 获取已经上传的切片信息
      const res = await http.post(
        '/upload_already',
        {
          HASH: HASH
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
      if (res.code == 0) {
        already = res.fileList
      }
    } catch (error) {
      // 之前没有上传过文件
    }

    // 实现文件切片处理
    //  1. 固定数量 
    //  2. 固定大小
    let max = 1024 * 100,
      count = Math.ceil(file.size / max), // 一共多少个切片
      idx = 0,
      chunks = []
    // 固定数量 和固定大小结合进行
    if (count > 100) {
      max = file.size / 100;
      count = 100
    }
    while (idx < count) {
      // idx 0 0~max
      // idx 1 max~max*2
      // idx 2 max*2~max*3
      // idx 3 max*3~max*4
      // idx*max ~ (idx+1)*max
      chunks.push({
        file: file.slice(idx * max, (idx + 1) * max),
        filename: `${HASH}_${idx + 1}.${suffix}`
      })
      idx++;
    }


    // 上传成功的处理
    idx = 0
    const clear = () => {
      // 重置处理
      val.css('width', `0}%`)
      text.html(``)
    }
    const complete = async () => {
      // 管控进度
      idx++;
      val.css('width', `${idx / count * 100}%`)
      text.html(`上传中: ${(idx / count * 100).toFixed(2)}%`)
      // 当所有切片都上传成功
      if (idx < count) return
      val.css('width', `100%`)
      text.html(`上传完成:100%`) 
      try {
        const res = await http.post('/upload_merge', {
          HASH:HASH,
          count:count
        }, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
        if (res.code == 0) {
          // 合并成功
          return
        }
        throw res.codeText

      } catch (error) {
        alert('切片合并失败')
        clear()
      }

    }

    // 把每一个切片都上传到服务器
    chunks.forEach(async i => {
      // 已经上传的不需要在上传
      if (already.length > 0 && already.includes(i.filename)) {
        complete()
        return
      }

      let fm = new FormData()
      fm.append('file', i.file)
      fm.append('filename', i.filename)
      try {
        const res = await http.post('/upload_chunk', fm)
        if (res.code == 0) {
          complete()
          return
        }
        return Promise.reject(res.codeText)
      } catch (error) {
        // alert('上传失败')
      }
    })
  })

  // 1. 点击选择文件按钮， 触发上传文件的输入框
  selectBtn.click(() => {
    // if(isCheckDisable('.selectBtn'))return
    upIpt.click();
  })
})();
