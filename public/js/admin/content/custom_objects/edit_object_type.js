var customFieldIndex = 0;

$(document).ready(function()
{
    $('#edit_object_type_form').validate(
    {
        rules:
        {
            name:
            {
                minlength: 2,
                required: true
            },
            url:
            {
                minlength: 2,
                required: true
            }
        }
    });
    
    $('#custom_fields_container').sortable({items: '.form-group', containment: 'document', cursor: 'move', axis: 'y'});
    $('#custom_fields_container').disableSelection();
    
    addInitialCustomFields();
});

function addInitialCustomFields()
{
    if(!customObject)
    {
        return;
    }
    
    var customObjectFields = customObject.fields;
    
    for(var key in customObjectFields)
    {
        if(key == 'name')
        {
            continue;
        }
    
        switch(customObjectFields[key].field_type)
        {
            case 'text':
                addCustomField('#value_template', key, loc.custom_objects.TEXT);
                break;
            case 'number':
                addCustomField('#value_template', key, loc.custom_objects.NUMBER);
                break;
            case 'date':
                addCustomField('#date_template', key);
                break;
            case 'peer_object':
                addCustomField('#peer_object_template', key, customObjectFields[key].object_type);
                break;
            case 'child_objects':
                addCustomField('#child_objects_template', key, customObjectFields[key].object_type);
                break;
        }
    }
}

function resetNameAvailability()
{
    $('#name_availability_button').attr('class', 'btn btn-default');
    $('#name_availability_button').html(loc.generic.CHECK);
}

function resetURLAvailability()
{
    $('#url_availability_button').attr('class', 'btn btn-default');
    $('#url_availability_button').html(loc.generic.CHECK);
}

function validateName()
{
    if($('#name').val().length == 0)
    {
        return;
    }
    
    if(customObject)
    {
        if($('#name').val().toLowerCase() == customObject.name.toLowerCase())
        {
            $('#name_availability_button').attr('class', 'btn btn-success');
            $('#name_availability_button').html('<i class="fa fa-check"></i>&nbsp;' + loc.generic.AVAILABLE);
            validateURL();
            return;
        }
    }
    
    $.getJSON('/api/custom_objects/get_object_type_name_available?name=' + $('#name').val(), function(response)
    {
        if(response.code == 0)
        {
            if(response.data)
            {
                $('#name_availability_button').attr('class', 'btn btn-success');
                $('#name_availability_button').html('<i class="fa fa-check"></i>&nbsp;' + loc.generic.AVAILABLE);
                
                setURLFromName();
            }
            else
            {
                $('#name_availability_button').attr('class', 'btn btn-danger');
                $('#name_availability_button').html('<i class="fa fa-ban"></i>&nbsp;' + loc.generic.UNAVAILABLE);
            }
        }
    });
}

function validateURL()
{
    if($('#url').val().length == 0)
    {
        return;
    }
    
    if(customObject)
    {
        if($('#url').val().toLowerCase() == customObject.url.toLowerCase())
        {
            $('#url_availability_button').attr('class', 'btn btn-success');
            $('#url_availability_button').html('<i class="fa fa-check"></i>&nbsp;' + loc.generic.AVAILABLE);
            return;
        }
    }
    
    $.getJSON('/api/custom_objects/get_object_type_url_available?url=' + $('#url').val(), function(response)
    {
        if(response.code == 0)
        {
            if(response.data)
            {
                $('#url_availability_button').attr('class', 'btn btn-success');
                $('#url_availability_button').html('<i class="fa fa-check"></i>&nbsp;' + loc.generic.AVAILABLE);
            }
            else
            {
                $('#url_availability_button').attr('class', 'btn btn-danger');
                $('#url_availability_button').html('<i class="fa fa-ban"></i>&nbsp;' + loc.generic.UNAVAILABLE);
            }
        }
    });
}

function setURLFromName()
{
    var url = $('#name').val().toLowerCase().split(' ').join('_');
    $('#url').val(url);
    validateURL();
}

function addCustomField(templateDiv, value, objectType)
{    
    var field = $(templateDiv).html().split('^index^').join(customFieldIndex);
    $('#custom_fields_container').append(field);
    
    if(typeof value !== 'undefined')
    {
        $('#custom_field_' + customFieldIndex + ' input').val(value);
    }
    else
    {
        $('#custom_field_' + customFieldIndex + ' input').val('');
    }
    
    if(typeof objectType !== 'undefined')
    {
        $('#object_type_' + customFieldIndex).html(objectType);
    }
    
    customFieldIndex++;
}

function removeCustomField(index)
{
    $('#custom_field_' + index).remove();
}

function selectObjectType(type, index)
{
    $('#object_type_' + index).html(type);
}

function prepareNewObjectTypeSave()
{
    var i = 0;
    var fieldOrder = [];
    
    if($('#custom_fields_container .form-group').length == 0)
    {
        $('#field_templates').remove();
        $('#edit_object_type_form').submit();
        return;
    }

    $('#custom_fields_container .form-group').each(function()
    {
        var index = parseInt($(this).attr('id').split('custom_field_').join(''));
        var inputGroup = $(this).find('.input-group').first();
        fieldOrder.push(index);
        
        if(inputGroup.attr('class').indexOf('value') > -1)
        {
            if($('#value_' + index).val().length == 0)
            {
                $('#value_' + index).remove();
            }
            else
            {
                switch($('#object_type_' + index).html())
                {
                    case loc.custom_objects.NUMBER:
                        $('#edit_object_type_form').append('<input type="text" name="field_type_' + index + '" value="number" style="display: none"></input>');
                        break;
                    case loc.custom_objects.TEXT:
                    default:
                        $('#edit_object_type_form').append('<input type="text" name="field_type_' + index + '" value="text" style="display: none"></input>');
                        break;
                }
            }
        }
        else if(inputGroup.attr('class').indexOf('date') > -1)
        {
            if($('#date_' + index).val().length == 0)
            {
                $('#date_' + index).remove();
            }
        }
        else if(inputGroup.attr('class').indexOf('peer_object') > -1)
        {
            if($('#peer_object_' + index).val().length == 0 || $('#object_type_' + index).html() == loc.custom_objects.OBJECT_TYPE)
            {
                $('#peer_object_' + index).remove();
            }        
            else
            {
                $('#edit_object_type_form').append('<input type="text" name="field_type_' + index + '" value="' + $('#object_type_' + index).html() + '" style="display: none"></input>');
            }
        }
        else if(inputGroup.attr('class').indexOf('child_objects') > -1 || $('#object_type_' + index).html() == loc.custom_objects.OBJECT_TYPE)
        {
            if($('#child_objects_' + index).val().length == 0)
            {
                $('#child_objects_' + index).remove();
            }
            else
            {
                $('#edit_object_type_form').append('<input type="text" name="field_type_' + index + '" value="' + $('#object_type_' + index).html() + '" style="display: none"></input>');
            }
        }
        
        i++;
        if(i >= $('#custom_fields_container .form-group').length)
        {
            $('#edit_object_type_form').append('<input type="text" name="field_order" value="' + fieldOrder.join(',') + '" style="display: none"></input>');
            $('#field_templates').remove();
            $('#edit_object_type_form').submit();
        }
    });
}