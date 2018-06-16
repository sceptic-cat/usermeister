var CityProto = {
    id: '',
    city: '',
    _row: null,
    /**
     * Валидируем свойства объекта
     * @returns {boolean}
     */
    validate: function () {
        var flag = true;
        if (!/^[А-ЯЁ][А-ЯЁa-яё\s-]{2,30}$/.test(this.city)) {
            $(this._row).find('.city-city').addClass('invalid');
            alert('Название города не корректно. Название должно начинаться с большой буквы и может содержать ' +
                'только русские символы, знаки дефиса и пробелы');
            flag = false;
        }
        if (flag) {
            $(this._row).find('.invalid').removeClass('invalid');
        }
        return flag;
    },
    save: function(){
        if (this.validate()) {
            $.ajax({
                url: 'index.php/cities/save',
                type: "POST",
                data: {
                    id: this.id,
                    city: this.city,
                },
                dataType: 'json',
                success: function (data) {
                    if (data['result'] == 'true') {
                        if (data['lastInsertId'] !== null) {
                            var new_row = $('.new-row');
                            new_row.find('.city-id').text(data['lastInsertId']);
                            new_row.removeClass('new-row');
                        }
                    }
                }
            });
        }
    }
}

function City(row, id, city){
    this.id = $.trim(id) || null;
    this.city = $.trim(city);
    this._row = row;
    this.__proto__ = CityProto
}

/**
 * Оборачиваем содержимое ячейки в input
 * @param obj
 */
function wrapUpInput(obj){
    var input = $(obj).find('input');
    if (input.length <= 0) {
        var val = $(obj).text();
        $(obj).html('<input type="text" maxlength="30" value="' + val + '">');
        var i = $(obj).find('input');
        $(i).focus();
        $(i).setCursorToTextEnd();
    }
}

/**
 * Убираем из ячейки input и возвращаем обычный текст
 * @param obj
 */
function expandInput(obj){
    var val = $(obj).val(),
        tr = $(obj).closest('.city-row');

    $(obj).parent().html(val);
    saveRow(tr);
}

function saveRow(row){
    var id = row.find('.city-id').text(),
        city = row.find('.city-city').text();

    var city = new City(row, id, city);
    city.save();
}

/**
 * ******************  DOCUMENT READY ******************
 */
$(document).ready(function(){

    var wrap = $('.city-wrap'),
        tbody = wrap.find('.city-table > tbody');

    /**
     * Добавляем строку в таблицу с пользователями для создания нового пользователя
     */
    $('.add-city').on('click', function(){
        tbody.append(
            '<tr class="city-row new-row">' +
            '<td class="city-id"></td>' +
            '<td class="city-city i-input">Город</td>' +
            '</tr>'
        );
    });

    /**
     * Оборачиваем содержимое ячейки таблицы в input
     */
    $(document).on('click', '.i-input', function(){
        wrapUpInput(this);
    });

    /**
     * Обрабатываем события потери фокуса и нажатия клавиши Enter в input элементе
     */
    $(document).on('blur', '.i-input > input', function(){
        expandInput(this);
    });
    $(document).on('keyup', '.i-input > input', function(e){
        if(e.keyCode == 13) $(this).blur();
    });

});