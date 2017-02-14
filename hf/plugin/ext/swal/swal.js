;(function($,swal){
    'use strict';
    if(!swal) return;
    swal.setDefaults({
        title: '',
        text: '',
        html: '',
        type: null,
        customClass: '',
        animation: true,
        allowOutsideClick: true,
        allowEscapeKey: true,
        showConfirmButton: true,
        showCancelButton: false,
        preConfirm: null,
        confirmButtonText: '确认',
        confirmButtonColor: null,
        confirmButtonClass: "btn hf-border-square btn-primary",
        cancelButtonText: '取消',
        cancelButtonColor: null,
        cancelButtonClass: "btn hf-btn hf-margin-left-xs",
        buttonsStyling: false,
        reverseButtons: false,
        focusCancel: false,
        showCloseButton: false,
        showLoaderOnConfirm: false,
        imageUrl: null,
        imageWidth: null,
        imageHeight: null,
        imageClass: null,
        timer: null,
        width: 500,
        padding: 20,
        background: '#fff',
        input: null, // 'text' | 'email' | 'password' | 'select' | 'radio' | 'checkbox' | 'textarea' | 'file'
        inputPlaceholder: '',
        inputValue: '',
        inputOptions: {},
        inputAutoTrim: true,
        inputClass: null,
        inputAttributes: {},
        inputValidator: null,
        onOpen: null,
        onClose: null
    });
}(window.jQuery,window.swal));